import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

Template.QuillEditor.viewmodel({
  editor: null,
  isExpanded: false,
  async onRendered(tpl) {
    const { default: Quill } = await import('quill');
    const containerElement = this.templateInstance.find('.editor-container');
    if (containerElement) {
      this.editor(new Quill(containerElement));
      this.editor().addModule('toolbar', {
        container: this.templateInstance.find('.editor-toolbar'),
      });
      this.editor().addModule('link-tooltip', true);

      const $modalDialog = $(tpl.firstNode.closest('.modal-dialog'));

      tpl.autorun(() => {
        if (this.isExpanded()) {
          $modalDialog.addClass('ql-expanded');
        } else {
          $modalDialog.removeClass('ql-expanded');
        }
      });
    }
  },
  toggleExpand() {
    return this.isExpanded(!this.isExpanded()) &&
      $(this.editor().container).closest('.modal').scrollTop(0);
  },
  onUpdate() {},
  update(e) {
    this.onUpdate(e, this);
  },
  getData() {
    const html = this.editor().getHTML();
    return { html };
  },
});
