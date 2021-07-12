import React, { useState } from 'react';
import styled from 'styled-components';
import ReactSelect from 'react-select';
import ReactSlider from 'react-slider';
import { Input } from 'reactstrap';

import { Colors } from 'styles';
import { getRangeArray } from 'utils';

const INPUT_HEIGHT = '2rem';

const Container = styled.div`
  margin-bottom: 1.5rem;

  .react-select {
    > div {
      min-height: ${INPUT_HEIGHT};
    }
  }
  .react-slider {
    display: flex;
    align-items: center;
  }
`;

type InputWrapperProps = {
  label?: Label;
};

const InputWrapper: React.FC<InputWrapperProps> = ({
  label,
  children,
  ...rest
}) => (
  <Container {...rest}>
    {label && <Label>{label}</Label>}
    {children}
  </Container>
);

type Label = string;

const Label = styled.label`
  font-weight: bold;
`;

type TextProps = {
  label?: Label;
  placeholder?: string;
  defaultValue?: string;
  onChange?(str: string): void;
};

export const Text: React.FC<TextProps> = ({
  label,
  placeholder,
  defaultValue,
  onChange,
}) => (
  <InputWrapper label={label}>
    <Input
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </InputWrapper>
);

/* Select */

type OptionValue = string | number;

type Option = {
  label: string;
  value: OptionValue;
};

type CommonSelectProps = {
  label?: Label;
  placeholder?: string;
  options: Option[];
  defaultValue?: OptionValue;
};

type SelectProps = CommonSelectProps & {
  onChange?: any;
  isMulti?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  onChange,
  placeholder,
  isMulti,
  defaultValue,
  ...rest
}) => (
  <InputWrapper label={label}>
    <ReactSelect
      className="react-select"
      options={options}
      isMulti={isMulti}
      onChange={(selected) =>
        onChange?.(
          isMulti
            ? (selected as Option[]).map((item) => item.value)
            : (selected as Option).value,
        )
      }
      placeholder={placeholder}
      defaultValue={options.find((option) => option.value === defaultValue)}
      {...rest}
    />
  </InputWrapper>
);

type MultiSelectProps = CommonSelectProps & {
  onChange?(selectedValues: OptionValue[]): void;
};

export const MultiSelect: React.FC<MultiSelectProps> = (props) => (
  <Select isMulti {...props} />
);

type IntegerSelectProps = Omit<CommonSelectProps, 'options'> & {
  min?: number;
  max: number;
  onChange?(selected: number): void;
};

export const IntegerSelect: React.FC<IntegerSelectProps> = ({
  min = 0,
  max,
  ...rest
}) => {
  const options = getRangeArray(max, min).map((value) => ({
    label: `${value}`,
    value,
  }));
  return <Select options={options} {...rest} />;
};

/* Slider */

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSlider = styled(ReactSlider)`
  height: ${INPUT_HEIGHT};
  flex: 2;
`;

const StyledThumb = styled.div`
  height: ${INPUT_HEIGHT};
  width: ${INPUT_HEIGHT};
  background-color: orange;
  border: 0.15rem yellow solid;
  cursor: grab;
  border-radius: 50%;
  z-index: 0 !important;
`;

const Thumb = (props: any) => <StyledThumb {...props} />;

const StyledTrack = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  background-color: ${({ index }: { index: number }) =>
    index !== 1 ? Colors.GreyDark : Colors.BlueDeepSky};
  border-radius: 1rem;
  padding: 0 1rem;
`;

const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
);

const ValueLabel = styled.div`
  flex: 1;
  font-size: 0.8rem;
  text-align: center;
`;

type SliderProps = {
  label?: Label;
  defaultValue?: OptionValue | OptionValue[];
  options: Option[];
  onChange?(selected: OptionValue | OptionValue[]): void;
};

export const Slider: React.FC<SliderProps> = ({
  label,
  options,
  defaultValue,
  onChange,
}) => {
  const lastIndex = options.length - 1;
  const isMultiple = Array.isArray(defaultValue);
  const defaultValueIndexes = isMultiple
    ? (defaultValue as OptionValue[]).map((dv) =>
        options.findIndex((option) => option.value === dv),
      )
    : 0;
  const [value, setValue] = useState<number | number[]>(defaultValueIndexes);
  const lowerLabel = (
    isMultiple ? options[(value as number[])[0]] : options[value as number]
  )?.label;
  const upperLabel = (
    isMultiple ? options[(value as number[])[1]] : options[lastIndex]
  ).label;

  const handleChange = (value: number | number[]) => {
    onChange?.(
      isMultiple
        ? (value as number[]).map((v) => options[v].value)
        : options[value as number].value,
    );
  };

  return (
    <InputWrapper label={label}>
      <SliderContainer>
        <ValueLabel>{lowerLabel}</ValueLabel>
        <StyledSlider
          className="react-slider"
          renderTrack={Track}
          renderThumb={Thumb}
          min={0}
          max={lastIndex}
          defaultValue={defaultValueIndexes}
          onChange={(value) => setValue(value as number | number[])}
          onAfterChange={(value) => handleChange(value as number | number[])}
        />
        <ValueLabel>{upperLabel}</ValueLabel>
      </SliderContainer>
    </InputWrapper>
  );
};
