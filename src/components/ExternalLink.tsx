import styled from 'styled-components';

import { Colors } from 'styles';

type ExternalLinkProps = {
  href: string;
  noUnderline?: boolean;
};

const ExternalLink = styled.a<ExternalLinkProps>`
  color: ${Colors.Black} !important;
  ${({ noUnderline }) =>
    noUnderline ? 'text-decoration: none !important;' : ''}
`;
ExternalLink.defaultProps = {
  target: '_blank',
};

export default ExternalLink;
