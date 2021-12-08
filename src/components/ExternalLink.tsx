import React from 'react';
import styled from 'styled-components';
import ReactGA, { OutboundLinkProps } from 'react-ga';

import { Colors } from 'styles';

ReactGA.initialize('UA-103950245-1');

const StyledTrackedLink = styled(({ noUnderline, ...props }) => (
  <ReactGA.OutboundLink {...props} />
))`
  color: ${Colors.Black} !important;
  ${({ noUnderline }: ExternalLinkProps) =>
    noUnderline ? 'text-decoration: none !important;' : ''}
`;

const StyledLink = styled(({ noUnderline, children, ...props }) => (
  <a {...props}>{children}</a>
))`
  color: ${Colors.Black} !important;
  ${({ noUnderline }: ExternalLinkProps) =>
    noUnderline ? 'text-decoration: none !important;' : ''}
`;

type ExternalLinkProps = Omit<OutboundLinkProps, 'onClick'> & {
  noUnderline?: boolean;
  skipTracking?: boolean;
};

const ExternalLink: React.FC<Omit<ExternalLinkProps, 'eventLabel'>> = ({
  skipTracking,
  ...rest
}) => {
  const props = { ...rest, target: '_blank' };
  return skipTracking ? (
    <StyledLink href={props.to} {...props} />
  ) : (
    <StyledTrackedLink eventLabel={props.to} {...props} />
  );
};

export default ExternalLink;
