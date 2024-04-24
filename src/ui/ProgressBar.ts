const EmptyLeft = `│`;
const FullLeft = `╞`;
const EmptyRight = `│`;
const FullRight = `╡`;
const Empty = ` `;
const Full = `═`;

export enum ProgressBarLabel {
  percentage,
  division
};

interface IProgress {
  value: number;
  maxValue: number;
  minValue: number;
  width: number;
  label?: ProgressBarLabel;
}

export const ProgressBar = ({
  value,
  maxValue,
  minValue,
  width,
  label
}: IProgress) => {
  const safeValue = Math.max(minValue, Math.min(maxValue, value));
  const percent = (safeValue - minValue) / (maxValue - minValue);
  const progress = Math.floor(width * percent);
  const empty = width - progress;
  let bar: string;
  if (progress === 0){
    bar = `${EmptyLeft}${Empty.repeat(empty - 2)}${EmptyRight}`;
  } else if (progress === width){
    bar = `${FullLeft}${Full.repeat(progress - 2)}${FullRight}`;
  } else {
    bar = `${FullLeft}${Full.repeat(progress - 1)}${Empty.repeat(empty - 1)}${EmptyRight}`;
  }

  if (label === undefined){
    return bar;
  }

  let labelValue: string;
  switch (label){
    case ProgressBarLabel.division:
      labelValue = ` ${safeValue.toFixed(1)} / ${maxValue.toFixed(1)} `;
      break;
    case ProgressBarLabel.percentage:
      labelValue = ` ${(percent * 100).toFixed(1)}% `;
      break;
  }
  const labelWidth = labelValue.length;
  if (labelWidth > width - 4){
    return bar;
  }

  const labelPosition = Math.floor((width - labelWidth) / 2);
  return bar.slice(0, labelPosition) + labelValue + bar.slice(labelPosition + labelWidth);
};