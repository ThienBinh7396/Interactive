/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
import { MockConfig } from "~/types/mock.type";
class MockApi {
  static #mockConfig: MockConfig[] = [];

  static {
    console.log("Run MockApi");
    const _open = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url) {
      let _onreadystatechange = this.onreadystatechange;

      const self = this;

      self.onreadystatechange = function () {
        if (self.readyState === 4) {
          const foundMock = MockApi.#foundMockFromUrl(url);

          if (foundMock) {
            try {
              // rewrite responseText
              Object.defineProperty(self, "responseText", {
                value: JSON.stringify(foundMock.mockValue.responseData),
              });

              Object.defineProperty(self, "status", {
                value: foundMock.mockValue.status,
              });
            } catch (e) {
              console.log(`Error occur when mock api with url: ${URL}`, e);
            }
          }
        }
        // call original callback
        if (_onreadystatechange)
          _onreadystatechange.apply(self, arguments as any);
      };

      // detect any onreadystatechange changing
      Object.defineProperty(this, "onreadystatechange", {
        get: function () {
          return _onreadystatechange;
        },
        set: function (value) {
          _onreadystatechange = value;
        },
      });

      return _open.apply(self, arguments as any);
    };
  }

  static addMock(mockConfig: MockConfig) {
    if (!this.#validateMock(mockConfig)) return;

    const foundMock = this.#findMock(mockConfig);

    if (foundMock) {
      foundMock.mockValue = mockConfig.mockValue;
    } else {
      this.#mockConfig.push(mockConfig);
    }
  }

  static resetMock() {
    this.#mockConfig = [];
  }

  static #foundMockFromUrl(url: URL | string) {
    console.log("this.#mockConfig: ", this.#mockConfig);
    console.log("URL: ", url);

    return this.#mockConfig.find(
      (mock) =>
        (mock.urlPatternString &&
          new RegExp(mock.urlPatternString).test(url.toString())) ||
        mock.url === url,
    );
  }

  static #findMock(mockConfig: MockConfig) {
    return this.#mockConfig.find(
      (mock) =>
        mock.url === mockConfig.url ||
        mock.urlPatternString === mockConfig.urlPatternString,
    );
  }

  static #validateMock(mockConfig: MockConfig) {
    const isValid = mockConfig.url || mockConfig.urlPatternString;

    if (!isValid) {
      console.error(
        `The mock config ${JSON.stringify(mockConfig)} is invalid!!!`,
      );
    }

    return isValid;
  }
}

export default MockApi;
