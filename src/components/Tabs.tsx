import React, { useState } from 'react';
import styled from 'styled-components';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { Colors } from 'styles';

const Link = styled(NavLink)`
  background-color: ${Colors.GreyOpacity};
  font-size: 0.9rem;
  cursor: pointer;
`;

type Value = string;

type TabsProps = {
  tabs: {
    value: Value;
    label: string | JSX.Element;
  }[];
  defaultValue?: Value;
  onChange?(value: Value): void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, defaultValue, onChange }) => {
  const [active, setActive] = useState<Value>(defaultValue ?? tabs?.[0].value);

  const handleChange = (value: Value) => {
    if (value !== active) {
      setActive(value);
      onChange?.(value);
    }
  };

  return (
    <Nav tabs>
      {tabs.map((tab, idx) => (
        <NavItem key={idx} onClick={() => handleChange(tab.value)}>
          <Link className={active === tab.value ? 'active' : ''}>
            {tab.label}
          </Link>
        </NavItem>
      ))}
    </Nav>
  );
};

export default Tabs;
