import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';
import property from 'lodash.property';

import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import {
  extractIds,
  flattenMap,
  inspire,
  findById,
  sortArrayByTitlePrefix,
  propEq,
  not,
  flattenMapStandards
} from '/imports/api/helpers.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router', 'utils', {
    counter: 'counter'
  }],
  hideRTextOnExpand: true,
  onCreated() {
    Meteor.defer(() => this.handleRoute());
  },
  handleRoute() {
    const standardId = this.standardId();
    const orgSerialNumber = this.organizationSerialNumber();
    const {
      result:contains,
      first:defaultStandard
    } = this._findStandardForFilter(standardId);

    if (!contains) {
      if (defaultStandard) {
        const { _id } = defaultStandard;

        this.goToStandard(_id);
        this.expandCollapsed(_id);
      } else {
        const params = { orgSerialNumber };
        const queryParams = { filter: FlowRouter.getQueryParam('filter') };
        FlowRouter.go('standards', params, queryParams);
      }
    }
  },
  _findStandardForFilter(_id) {
    const finder = findById(_id);
    const activeStandardFilterId = this.activeStandardFilterId();
    const results = (items) => ({
      result: findById(_id, items),
      first: _.first(items),
      array: items
    });

    switch(activeStandardFilterId) {
      case 1:
        const sections = this.sections();
        const mappedSections = flattenMapStandards(sections);
        return results(mappedSections);
        break;
      case 2:
        const types = this.types();
        const mappedTypes = flattenMap(property('items'), types);
        const mappedTypesSections = flattenMapStandards(mappedTypes);
        return {
          result: finder(mappedTypes) || finder(mappedTypesSections),
          first: (() => {
            // because there may be a situation when only 'Uncategorized' type exists
            const firstMappedType = _.first(mappedTypes);

            if (get(firstMappedType, 'standards')) {
              return _.first(mappedTypesSections);
            }

            return firstMappedType;
          })(),
          array: (() => {
            const uncategorizedItems = mappedTypes.filter(_.compose(not, property('standards')));
            return _.compact(mappedTypesSections.concat(uncategorizedItems));
          })()
        };
        break;
      case 3:
        const standardsDeleted = this.standardsDeleted();
        return results(standardsDeleted);
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    const fields = [{ name: 'title' }, { name: 'description' }, { name: 'status' }];

    return this.searchObject('searchText', fields, this.isPrecise());
  },
  _getTotalUnreadMessages(standards) {
    const standardsIds = extractIds(standards);
    const totalUnreadMessages = standardsIds.reduce((prev, cur) => {
      return prev + this.counter.get('standard-messages-not-viewed-count-' + cur);
    }, 0);

    return totalUnreadMessages;
  },
  sections(typeId) {
    const organizationId = this.organizationId();
    const mainQuery = { organizationId, ...this._getSearchQuery() };

    // All sections of the current organization
    const sections = ((() => {
      const query = { organizationId };
      const options = { sort: { title: 1 } };
      const _sections = StandardsBookSections.find(query, options).fetch();

      return sortArrayByTitlePrefix(_sections);
    })());

    /**
     * Filter the sections which fit the search query and have the standards
     * connected
    */
    const filtered = sections.filter(({ _id: sectionId }) => {
      const query = ((() => {
        const _query = { sectionId, ...mainQuery };
        return typeId ? { ..._query, typeId } : _query;
      })());
      return this._getStandardsByQuery(query).count() > 0;
    });

    // Add appropriate standards to the filtered sections
    const withStandards = filtered.map((section) => {
      const standards = this._getStandardsByQuery(mainQuery)
        .fetch()
        .filter((standard) => {
          return Object.is(section._id, standard.sectionId) &&
                 (typeId ? Object.is(typeId, standard.typeId) : true);
        });

      sortArrayByTitlePrefix(standards);

      return Object.assign({}, section, {
        standards,
        unreadMessagesCount: this._getTotalUnreadMessages(standards),
      });
    });

    /**
     * Adding "Uncategorized" section: only for standards grouped by sections
    */
    const withUncategorized = ((() => {
      const predicate = standard => !sections.filter(({ _id }) => Object.is(_id, standard.sectionId)).length;
      const query = typeId ? { typeId, ...mainQuery } : mainQuery;
      const standards = this._getStandardsByQuery(query).fetch().filter(predicate);

      if (standards.length) {
        return withStandards.concat({
          organizationId,
          standards,
          _id: `StandardsBookSections.Uncategorized:${typeId || ''}`, // We need a fake id here for searching purposes
          title: 'Uncategorized',
          unreadMessagesCount: this._getTotalUnreadMessages(standards),
        });
      }

      return withStandards;
    })());

    return withUncategorized;
  },
  types() {
    const organizationId = this.organizationId();
    // Standard types for this organization
    const types = ((() => {
      const query = { organizationId };
      const options = { sort: { title: 1 } };
      return StandardTypes.find(query, options).fetch();
    })());

    // Type objects with sections
    const withSections = types.map((type) => {
      const sections = this.sections(type._id);
      const unreadMessagesCount = sections.reduce((prev, cur) => prev + cur.totalUnreadMessages, 0);
      const items = sections;

      return Object.assign({}, type, {
        items,
        sections,
        unreadMessagesCount,
        typeTemplate: 'StandardTypeItem'
      });
    });

    const filtered = withSections.filter(({ sections }) => sections.length);

    /**
     * Adding "Uncategorized" type section: only for standards grouped by types
    */
    // Find standards of non-existent types
    const withUncategorized = ((() => {
      const predicate = standard => !types.filter(({ _id }) => Object.is(_id, standard.typeId)).length;
      const query = { organizationId, ...this._getSearchQuery() };
      const standards = this._getStandardsByQuery(query).fetch().filter(predicate);

      if (standards.length) {
        return filtered.concat({
          organizationId,
          _id: 'StandardTypes.Uncategorized', // We need a fake id here for searching purposes
          items: standards,
          title: 'Uncategorized',
          typeTemplate: 'StandardSectionItem',
          unreadMessagesCount: this._getTotalUnreadMessages(standards),
        });
      }

      return filtered;
    })());

    return withUncategorized;
  },
  standardsDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getStandardsByQuery(query, options).fetch();
  },
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  _transform() {
    return () => ({
      onValue: vms => this.sortVms(vms, true),
      onEmpty: vms => this.sortVms(vms, false)
    });
  },
  onSearchInputValue() {
    return (value) => {
      const result = extractIds(this._findStandardForFilter().array);
      return result;
    }
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Standard',
        template: 'CreateStandard',
        variation: 'save'
      });
  }
});
