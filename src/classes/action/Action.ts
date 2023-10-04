import { SAMPLE_IMAGE_URL } from "~/constant/constant";
import { SampleImageFileData, SelectActionConfig } from "~/types/action.type";

class Action {
  waitTimeout?: number = undefined;
  endInterval = 0;
  waitInterval?: number = undefined;

  static sampleImageFileData: SampleImageFileData = {
    value: null,
    status: "initial",
  };

  constructor() {
    this.loadSampleImage();
  }

  clearInterval() {
    window.clearInterval(this.waitInterval);
    this.waitInterval = undefined;
  }

  async loadSampleImage() {
    if (Action.sampleImageFileData.status !== "initial") return;
    return new Promise((resolve) => {
      Action.sampleImageFileData.status = "loading";

      this.getImageDataFromUrl(SAMPLE_IMAGE_URL, (imageBlob: BlobPart) => {
        const fileName = "hasFilename.jpg";
        const file = new File([imageBlob], fileName, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        const container = new DataTransfer();
        container.items.add(file);

        Action.sampleImageFileData = {
          value: container.files,
          status: "done",
        };

        resolve(null);
      });
    });
  }

  async getSampleImageFile() {
    if (!Action.sampleImageFileData.value) {
      await this.loadSampleImage();
    }
    return Action.sampleImageFileData.value as FileList;
  }

  getImageDataFromUrl(url: string, callback: (data: BlobPart) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  isFileUpload(selector: string) {
    return (
      this.checkElementExist(selector) &&
      this.selector(selector)?.getAttribute("type") === "file"
    );
  }

  findElementByText(text: string) {
    return document
      .evaluate(
        `//span[contains(text(), '${text}')]`,
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
      )
      .iterateNext();
  }

  selector(selector: string) {
    return document.querySelector(selector) as HTMLElement | null;
  }

  toInputElement(selector: string) {
    const selectorNode = this.selector(selector);

    if (selectorNode instanceof HTMLInputElement) {
      return selectorNode;
    }

    return null;
  }

  selectorAll(selector: string) {
    return Array.from(document.querySelectorAll(selector) || []);
  }

  checkElementExist(selector: string) {
    return !!document.querySelector(selector);
  }

  clickTo(selector: string) {
    const nodeElement = this.selector(selector);

    if (!nodeElement) {
      console.error(
        `The element with the ${selector} selector does not exist.`,
      );
      return;
    }

    nodeElement.scrollIntoView();
    nodeElement.click();
  }

  async select(
    selector: string,
    value: string,
    config: SelectActionConfig = {
      isDispatchChangeEvent: true,
      timeout: 0.2
    },
  ) {
    const selectorNode = this.selector(selector);
    if (!selectorNode) {
      console.error(
        `The element with the ${selector} selector does not exist.`,
      );
      return;
    }

    if (selectorNode instanceof HTMLSelectElement) {
      selectorNode.scrollIntoView();
      selectorNode.value = value;

      if (config.isDispatchChangeEvent) {
        await this.waitTime(config.timeout || 0.2);
        selectorNode.dispatchEvent(new Event("change"));
      }
    }
  }

  async selectFirstElement(selector: string, value?: string) {
    const selectorNode = this.selector(selector);
    if (!selectorNode) {
      console.error(
        `The element with the ${selector} selector does not exist.`,
      );
      return;
    }

    const isOptionAvailable = await this.waitFor(
      () => {
        const optionNode = selectorNode.querySelectorAll("option");

        return !!optionNode && optionNode.length >= 2;
      },
      {
        interval: 300,
      },
    );

    if (!isOptionAvailable) {
      console.error(
        `The element with the ${selector} selector doesn' have any options!`,
      );
      return;
    }

    if (selectorNode instanceof HTMLSelectElement) {
      selectorNode.value =
        value ||
        selectorNode
          .querySelector("option:nth-child(2)")
          ?.getAttribute("value") ||
        "";
      selectorNode.scrollIntoView();
      await this.waitTime(0.2);
      selectorNode.dispatchEvent(new Event("change"));
    }
  }

  async fillField(selector: string, value: string, isClearBeforeFill = false) {
    const selectorNode = this.selector(selector);

    if (!selectorNode) {
      console.error(
        `The element with the ${selector} selector does not exist.`,
      );
      return;
    }

    if (
      selectorNode instanceof HTMLTextAreaElement ||
      selectorNode instanceof HTMLInputElement
    ) {
      if (isClearBeforeFill) {
        selectorNode.value = "";
        await this.waitTime(0.05);
        selectorNode.dispatchEvent(new Event("input"));
        await this.waitTime(0.05);
      }

      selectorNode.value = value;
      selectorNode.scrollIntoView();
      await this.waitTime(0.2);
      selectorNode.dispatchEvent(new Event("input"));
    }
  }

  async uploadFile(selector: string) {
    if (!this.checkElementExist(selector)) {
      console.error(
        `The element with the ${selector} selector does not exist.`,
      );
      return;
    }

    this.clickTo(`${selector} label`);
    const uploadImageNodeString = `${selector}-reader input[name='image-select-input']`;
    await this.waitForAvailable(uploadImageNodeString);
    const uploadImageNode = this.selector(uploadImageNodeString);

    if (!this.isFileUpload(uploadImageNodeString)) {
      console.error(
        `Cannot find upload file element with the ${selector} selector.`,
      );
      return;
    }

    if (!(uploadImageNode instanceof HTMLInputElement)) {
      return;
    }

    uploadImageNode.files = await Action.sampleImageFileData.value;
    uploadImageNode.dispatchEvent(new Event("change"));

    const okButtonSelector = `${selector}-ok`;

    const isOkButtonClickable = await this.waitForClickable(okButtonSelector);

    if (!isOkButtonClickable) {
      console.error(
        `Cannot find upload file element with the ${selector} selector.`,
      );
      return;
    }

    this.clickTo(okButtonSelector);
  }

  waitTime(timeout: number) {
    return new Promise((resolve) => {
      if (this.waitTimeout) {
        window.clearTimeout(this.waitTimeout);
      }

      this.waitTimeout = window.setTimeout(() => {
        resolve(null);
      }, timeout * 1000);
    });
  }

  waitFor(
    condition: () => boolean,
    options?: { timeout?: number; interval?: number },
  ) {
    const timeout = options?.timeout || 30; // s
    const interval = options?.interval || 200; // ms

    return new Promise((resolve) => {
      if (this.waitInterval) {
        this.clearInterval();
      }

      this.endInterval = new Date().getTime() + timeout * 1000;

      this.waitInterval = window.setInterval(() => {
        if (new Date().getTime() >= this.endInterval) {
          this.clearInterval();

          console.log("Fail in Interactive.waitFor");
          resolve(false);
        }

        if (condition()) {
          console.log("Success in Interactive.waitFor");
          this.clearInterval();
          resolve(true);
        }
      }, interval);
    });
  }

  async waitForAvailable(selector: string, options?: { timeout: number }) {
    const timeout = options?.timeout || 10000;

    return await this.waitFor(
      () => {
        const elementNode = this.selector(selector);

        const isElementClickable =
          elementNode?.getAttribute("disabled") !== "disabled";

        return !!elementNode && isElementClickable;
      },
      { timeout },
    );
  }

  async waitForClickable(selector: string, options?: { timeout: number }) {
    const timeout = options?.timeout || 10000;

    return await this.waitFor(
      () => {
        const elementNode = this.selector(selector);

        const isElementClickable =
          elementNode?.style?.pointerEvents !== "none" &&
          elementNode?.getAttribute("disabled") !== "disabled";

        return !!elementNode && isElementClickable;
      },
      { timeout },
    );
  }
}

export default Action;
