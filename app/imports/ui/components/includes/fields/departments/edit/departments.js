import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.Departments_Edit.viewmodel({
  mixin: ['search', 'organization', 'department'],
  departmentsIds: [],
  selected() {
    const departmentsIds = Array.from(this.departmentsIds() || []);
    return this._getDepartmentsByQuery({ _id: { $in: departmentsIds }});
  },
  value() {
    const child = this.child('Select_Multi');
    return child && child.value();
  },
  departments() {
    const query = { ...this.searchObject('value', 'name') };

    return this._getDepartmentsByQuery(query);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItemId, selected } = viewmodel.getData();

    if (this.areIdsIncludesItemId(selectedItemId)) return;

    const newDepartmentsIds = this.concatIds(this.departmentsIds(), selectedItemId);

    this.departmentsIds(newDepartmentsIds);

    this.callUpdate(selectedItemId, selected, '$addToSet');
  },
  callUpdate(selectedItemId, selected, option) {
    if (!this._id) return;

    const options = {
      [`${option}`]: {
        departmentsIds: selectedItemId
      }
    };

    this.parent().update({ options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItemId, selected } = viewmodel.getData();

    if (!this.areIdsIncludesItemId(selectedItemId)) return;

    const newDepartmentsIds = this.filterIds(this.departmentsIds(), selectedItemId);

    this.departmentsIds(newDepartmentsIds);

    this.callUpdate(selectedItemId, selected, '$pull');
  },
  concatIds(ids, id) {
    return Array.from(ids || []).concat([id]);
  },
  filterIds(ids, id) {
    return Array.from(ids || []).filter(_id => _id !== id);
  },
  areIdsIncludesItemId(selectedItemId) {
    return this.departmentsIds() && this.departmentsIds().includes && this.departmentsIds().includes(selectedItemId);
  },
  getData() {
    const { departmentsIds } = this.data();
    return { departmentsIds };
  }
});
