export type Option = {
  label: string;
};

type OnChange<T> = (option?: T) => void;

export class RadioList<T extends Option> {

  /** Will never render more than this number of lines, unless maxHeight < 5, in which case it may render at least 5 lines */
  private maxHeight: number;

  /** Scrolled to this item first. Automatically moves to keep a selected item visible */
  private windowStart: number;

  constructor(maxHeight: number){
    this.maxHeight = Math.max(maxHeight, 5);
    this.windowStart = 0;
  }

  public render = (
    items: T[],
    selected?: T,
  ): string => {
    const {maxHeight} = this;
    const maxItemsShown = maxHeight - 2; // leave a line above and below even when there's no arrows
    if (items.length === 0){
      return "";
    } else if (items.length <= maxItemsShown){ // leave a line above and below even when there's no arrows
      return `\n${this.renderItems(items, selected)}\n`;
    }

    const selectedIndex = items.indexOf(selected);
    if (selectedIndex !== -1){
      if (this.windowStart >= selectedIndex && this.windowStart > 0){ // if the selected items is too high in the window or out of window entirely
        this.windowStart = Math.max(0, selectedIndex - 1);
      } else if (this.windowStart + maxItemsShown <= selectedIndex + 1){ // if the selected item is too low in the window or out of window entirely
        this.windowStart = Math.min(selectedIndex - maxItemsShown + 2, items.length - maxItemsShown);
      }
    }

    const sliceStart = this.windowStart;
    const skippedAtStart = this.windowStart;
    const sliceEnd = this.windowStart + maxItemsShown;
    const skippedAtEnd = items.length - sliceEnd;
    return `${this.renderUpArrow(skippedAtStart)}\n${this.renderItems(items.slice(sliceStart, sliceEnd), selected)}\n${this.renderDownArrow(skippedAtEnd)}`;
  }

  private renderUpArrow = (itemsSkipped: number) => {
    return itemsSkipped === 0 ? "" : ` ⇡ ${itemsSkipped} More`;
  }

  private renderDownArrow = (itemsSkipped: number) => {
    return itemsSkipped === 0 ? "" : ` ⇣ ${itemsSkipped} More`;
  }

  private renderItem = (item: T, isSelected: boolean) => {
    return `${isSelected ? "[*]" : "[ ]"} ${item.label}`;
  }

  private renderItems = (slice: T[], selected: T) => {
    return slice.map(item => this.renderItem(item, item === selected)).join("\n");
  }
}