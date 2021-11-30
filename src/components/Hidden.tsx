import styled from 'styled-components';

type HiddenProps = {
  shouldHide?: boolean;
};

const Hidden = styled.div<HiddenProps>`
  ${({ shouldHide }) => (shouldHide ? 'display: none;' : '')}
`;

export default Hidden;
