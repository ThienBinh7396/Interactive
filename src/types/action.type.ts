export type CharacterNameConfig = {
  firstNameKanji?: string;
  lastNameKanji?: string;
  firstNameKana?: string;
  lastNameKana?: string;
};

export type CharacterBirthdayConfig = {
  birthday?: string;
  isAdult?: boolean;
};

export type SampleImageFileData = {
  value: FileList | null;
  status: "initial" | "loading" | "done" | "error";
};

export type SelectActionConfig = {
  isDispatchChangeEvent: boolean;
  timeout?: number;
};
