export type MockValue = {
  status: number;
  responseData: unknown;
};

export type MockConfig = {
  url?: string;
  urlPatternString?: string;
  mockValue: MockValue;
};
