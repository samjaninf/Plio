/* eslint-disable no-param-reassign */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import curry from 'lodash.curry';
import { applyMiddleware } from 'plio-util';

import { UNAUTHORIZED } from './errors';
import { checkDocAndMembershipAndMore } from './checkers';

export const withCallPromise = function (options) {
  Object.assign(options, {
    callP: function callP(args) {
      return new Promise((resolve, reject) => {
        this.call(args, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    },
  });
  return options;
};
export default class Method extends ValidatedMethod {
  constructor(props) {
    const { run } = props;

    props.mixins = Object.assign([], props.mixins).concat([LoggedInMixin, withCallPromise]);
    props.checkLoggedInError = {
      error: '403',
      reason: UNAUTHORIZED.reason,
    };

    props.run = function ({ ...args }) {
      const res = props.check && props.check.call(this, checker => checker.call(this, { ...args }));

      return run.call(this, { ...args }, res);
    };

    super(props);
  }
}

export class CheckedMethod extends ValidatedMethod {
  constructor(props) {
    if (!props.check) throw new Error('"check" method is required');

    const { run } = props;

    props.mixins = Object.assign([], props.mixins).concat([LoggedInMixin, withCallPromise]);
    props.checkLoggedInError = {
      error: '403',
      reason: UNAUTHORIZED.reason,
    };

    props.run = function ({ ...args }) {
      const { userId } = this;

      const res = props.check.call(this, collection =>
        (checker, err) => checkDocAndMembershipAndMore(collection, args._id, userId)(
          curry(checker)({ ...args, userId }),
          err,
        ));

      return run.call(this, { ...args }, res);
    };

    super(props);
  }
}

export class MiddlewareMethod extends ValidatedMethod {
  constructor({ middleware, ...props }) {
    const mixins = [withCallPromise];

    const run = async function (args) {
      const { userId } = this;
      const context = { userId };
      return applyMiddleware(...middleware)(
        (root, ...otherArgs) => props.run.apply(this, otherArgs),
      )(null, args, context);
    };

    super({ ...props, run, mixins });
  }
}
