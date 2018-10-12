import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import invoke from 'lodash.invoke';

import { getNestingLevel } from '../../../../../../share/helpers';

Template.Standards_Title_Edit.viewmodel({
  mixin: 'numberRegex',
  title: '',

  titleArgs() {
    const { title: value } = this.data();
    const withFocusCheck = !!this._id;

    return {
      value,
      withFocusCheck,
      label: 'Document title',
      onFocusOut: (e, { value: title }) => {
        const nestingLevel = getNestingLevel(title);

        if (nestingLevel > 4) {
          return invoke(
            ViewModel.findOne('ModalWindow'),
            'setError',
            'Maximum nesting is 4 levels. Please change your title.',
          );
        }

        this.title(title);

        if (!this._id) return null;

        return invoke(this.parent(), 'update', { title, nestingLevel });
      },
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  },
});
