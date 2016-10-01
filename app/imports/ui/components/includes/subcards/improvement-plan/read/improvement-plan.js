import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';

Template.Subcards_ImprovementPlan_Read.viewmodel({
  mixin: ['user', 'date'],
  autorun() {
    this.load(this.doc());
  },
  label: 'Improvement plan',
  desiredOutcome: '',
  targetDate: '',
  owner: '',
  reviewDates: [],
  files() {
    const fileIds = this.doc().fileIds || [];
    return Files.find({ _id: { $in: fileIds } });
  },
  doc() {
    return this.improvementPlan();
  },
  IPHasFields({ desiredOutcome, targetDate, reviewDates, owner, files }) {
    return desiredOutcome || targetDate || owner || ( reviewDates && reviewDates.length > 0 ) || ( files && files.length );
  },
  renderReviewDates(dates) {
    return dates.map(doc => this.renderDate(doc.date)).join(', ');
  },
});
