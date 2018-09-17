import { branch } from 'recompose';
import { isNil, identity } from 'ramda';
import withStateToggle from './withStateToggle';

const withToggle = (defaultValue = false) => branch(
  ({ toggle, isOpen }) => toggle || !isNil(isOpen),
  identity,
  withStateToggle(defaultValue, 'isOpen', 'toggle'),
);

export const WithToggle = withToggle()(({ children, ...props }) => children(props));

export default withToggle;
