import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "../../utils/validationSchema";

const getValidationError = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return null;
  } catch (err) {
    return err.inner.reduce((acc, current) => {
      acc[current.path] = current.message;
      return acc;
    }, {});
  }
};

// ============================
//     Login Schema 單元測試
// ============================
describe("loginSchema", () => {
  it("當所有欄位都有效時，應成功通過驗證", async () => {
    const validData = {
      email: "test@example.com",
      password: "Password123",
      ReCAPTCHA: "token",
    };
    const errors = await getValidationError(loginSchema, validData);

    // *測試* 應回傳空值(成功)
    expect(errors).toBeNull();
  });

  describe("Email 欄位驗證", () => {
    it("當 email 為空時，應回傳必填錯誤", async () => {
      const invalidData = {
        email: "",
        password: "Password123",
        ReCAPTCHA: "token",
      };
      const errors = await getValidationError(loginSchema, invalidData);

      // *測試*
      expect(errors.email).toBe("* 此為必填欄位");
    });

    it("當 email 格式無效時，應回傳格式錯誤", async () => {
      const invalidData = {
        email: "test-example",
        password: "Password123",
        ReCAPTCHA: "token",
      };
      const errors = await getValidationError(loginSchema, invalidData);

      // *測試*
      expect(errors.email).toBe("* 請輸入有效的電子郵件格式");
    });
  });

  describe("Password 欄位驗證", () => {
    it("當 password 為空時，應回傳必填錯誤", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
        ReCAPTCHA: "token",
      };
      const errors = await getValidationError(loginSchema, invalidData);

      // *測試*
      expect(errors.password).toBe("* 此為必填欄位");
    });

    it("當 password 長度少於 8 個字元時，應回傳長度錯誤", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "1234567",
        ReCAPTCHA: "token",
      };
      const errors = await getValidationError(loginSchema, invalidData);

      // *測試*
      expect(errors.password).toBe("* 密碼長度不能少於 8 個字元");
    });
  });

  describe("ReCAPTCHA 欄位驗證", () => {
    it("當 ReCAPTCHA 未勾選時，應回傳必填錯誤", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "Password123",
        ReCAPTCHA: "",
      };
      const errors = await getValidationError(loginSchema, invalidData);

      // *測試*
      expect(errors.ReCAPTCHA).toBe("* 請勾選完成驗證");
    });
  });

  it("當有多個欄位無效時，應回傳所有對應的錯誤訊息", async () => {
    const invalidData = {
      email: "test-example",
      password: "123",
      ReCAPTCHA: "",
    };
    const errors = await getValidationError(loginSchema, invalidData);

    // *測試* 是否都會正常報錯
    expect(errors).toEqual({
      email: "* 請輸入有效的電子郵件格式",
      password: "* 密碼長度不能少於 8 個字元",
      ReCAPTCHA: "* 請勾選完成驗證",
    });
  });
});

// ===============================
//     Register Schema 單元測試 ---
// ===============================
describe("registerSchema", () => {
  it("當所有欄位都有效時，應成功通過驗證", async () => {
    const validData = {
      username: "testUser",
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      terms: true,
      ReCAPTCHA: "token",
    };
    const errors = await getValidationError(registerSchema, validData);

    // *測試* 應回傳空值(成功)
    expect(errors).toBeNull();
  });

  describe("Username 欄位驗證", () => {
    it("當 username 為空時，應回傳必填錯誤", async () => {
      const invalidData = { username: "" };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.username).toBe("* 此為必填欄位");
    });

    it("當 username 太短時，應回傳長度錯誤", async () => {
      const invalidData = { username: "a" };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.username).toBe("* 使用者名稱至少需要 3 個字元");
    });

    it("當 username 太長時，應回傳長度錯誤", async () => {
      const invalidData = { username: "username0123456789ABC" };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.username).toBe("* 使用者名稱不能超過 20 個字元");
    });
  });

  describe("Email 欄位驗證", () => {
    it("當 email 為空時，應回傳必填錯誤", async () => {
      const invalidData = { email: "" };
      const errors = await getValidationError(registerSchema, invalidData);
      expect(errors.email).toBe("* 此為必填欄位");
    });

    it("當 email 格式無效時，應回傳格式錯誤", async () => {
      const invalidData = { email: "invalid-email" };
      const errors = await getValidationError(registerSchema, invalidData);
      expect(errors.email).toBe("* 請輸入有效的電子郵件格式");
    });
  });

  describe("Password 與 ConfirmPassword 欄位驗證", () => {
    it("當 password 與 ConfirmPassword 為空時，應回傳必填錯誤", async () => {
      const invalidData = {
        password: "",
        confirmPassword: "",
      };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.password).toBe("* 此為必填欄位");
      expect(errors.confirmPassword).toBe("* 此為必填欄位");
    });

    it("當 password 不符合規則時，應回傳對應的錯誤訊息", async () => {
      const invalidData = {
        password: "password",
        confirmPassword: "password",
      };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.password).toBe("* 密碼須至少 8 碼，且包含大小寫英文及數字");
    });

    it("當 password 字元太長時，應回傳對應的錯誤訊息", async () => {
      const invalidData = {
        password: "password0123456789ABC",
        confirmPassword: "password0123456789ABC",
      };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.password).toBe("* 密碼不能超過 20 個字元");
    });

    it("當 confirmPassword 與 password 不一致時，應回傳不一致的錯誤", async () => {
      const invalidData = {
        password: "Password123",
        confirmPassword: "Password456",
      };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.confirmPassword).toBe("兩次輸入的密碼不一致");
    });
  });

  describe("Terms 欄位驗證", () => {
    it("當 terms 未勾選 (為 false) 時，應回傳錯誤", async () => {
      const invalidData = { terms: false };
      const errors = await getValidationError(registerSchema, invalidData);

      // *測試*
      expect(errors.terms).toBe("* 請詳閱並同意服務條款");
    });
  });

  describe("ReCAPTCHA 欄位驗證", () => {
    it("當 ReCAPTCHA 未勾選時，應回傳必填錯誤", async () => {
      const invalidData = { ReCAPTCHA: "" };
      const errors = await getValidationError(registerSchema, invalidData);
      expect(errors.ReCAPTCHA).toBe("* 請勾選完成驗證");
    });
  });

  it("當有多個欄位無效時，應回傳所有對應的錯誤訊息", async () => {
    const invalidData = {
      username: "a",
      email: "test-example",
      password: "password",
      confirmPassword: "Password",
      terms: false,
      ReCAPTCHA: "",
    };
    const errors = await getValidationError(registerSchema, invalidData);

    // *測試* 是否都會正常報錯
    expect(errors).toEqual({
      username: "* 使用者名稱至少需要 3 個字元",
      email: "* 請輸入有效的電子郵件格式",
      password: "* 密碼須至少 8 碼，且包含大小寫英文及數字",
      confirmPassword: "兩次輸入的密碼不一致",
      terms: "* 請詳閱並同意服務條款",
      ReCAPTCHA: "* 請勾選完成驗證",
    });
  });
});
