import Common from "./Common";

class OptionsPage extends Common {
  // datazoryo, super_daretei_S, kosyou_pp_b, security_iphone, group_call, number_block, warikomi_call, wide_support
  selectOption(optionId: string, isSelected: boolean) {
    const optionSelectorString = `#first-${optionId}`;
    const optionSelectorNode = this.selector(optionSelectorString);

    if (!optionSelectorNode) {
      console.log(`Option ${optionId} isn't exists.`);
      return;
    }

    if (isSelected) {
      this.clickTo(optionSelectorString);
      return;
    }

    const parentNode = optionSelectorNode.closest("div");
    const noOptionNode = parentNode?.querySelector("input[id$='no-option']");

    if (noOptionNode && noOptionNode instanceof HTMLElement) {
      noOptionNode.click();
    }
  }
}

export default OptionsPage;
