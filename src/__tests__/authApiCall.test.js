import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import {
  mockLoginApiCall,
  mockRegisterApiCall,
  axiosLoginApiCall,
  axiosRegisterApiCall,
} from "../api/authApiCall";

vi.mock("axios");

// --- Mock API (本地Promise) 單元測試 ---
describe("Mock API (本地Promise) 呼叫", () => {
  describe("mockLoginApiCall", () => {
    it("當 email 和 password 正確時，應 resolve 並回傳使用者資料", async () => {
      const loginData = { email: "test@example.com", password: "Password123" };

      // *測試*
      await expect(mockLoginApiCall(loginData)).resolves.toEqual({
        id: 1,
        email: "test@example.com",
        name: "Mock User",
      });
    });

    it("當 password 錯誤時，應 reject 並回傳錯誤訊息", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      // *測試*
      await expect(mockLoginApiCall(loginData)).rejects.toThrow("密碼不一致");
    });
  });

  describe("mockRegisterApiCall", () => {
    it("對於新用戶，應 resolve 並回傳新的使用者資料", async () => {
      const registerData = {
        email: "new@example.com",
        password: "somePassword",
      };

      // *測試*
      await expect(mockRegisterApiCall(registerData)).resolves.toEqual({
        id: 2,
        email: "new@example.com",
        name: "New Mock User",
      });
    });

    it("對於已存在的用戶，應 reject 並回傳錯誤訊息", async () => {
      const registerData = {
        email: "test@example.com",
        password: "somePassword",
      };

      // *測試*
      await expect(mockRegisterApiCall(registerData)).rejects.toThrow(
        "此電子郵件已被註冊"
      );
    });
  });
});

// --- Axios API (JSON伺服器) 單元測試 ---
describe("Axios API (JSON伺服器) 呼叫", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("axiosLoginApiCall", () => {
    it("登入成功：當使用者存在且密碼正確，應回傳不含密碼的使用者資料", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "Password123",
      };
      axios.get.mockResolvedValue({ data: [mockUser] });

      const result = await axiosLoginApiCall({
        email: "test@example.com",
        password: "Password123",
      });

      // *測試* 請求網址是否正確
      expect(axios.get).toHaveBeenCalledWith(
        "/api/users?email=test@example.com"
      );
      // *測試* 回傳值是否無密碼
      expect(result).toEqual({ id: 1, email: "test@example.com" });
    });

    it("登入失敗：當使用者不存在時，應拋出「尚未註冊」的錯誤", async () => {
      axios.get.mockResolvedValue({ data: [] });

      // *測試*
      await expect(
        axiosLoginApiCall({
          email: "test@example.com",
          password: "Password123",
        })
      ).rejects.toThrow("此電子郵件尚未註冊");
    });

    it("登入失敗：當密碼不一致時，應拋出「密碼不一致」的錯誤", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "Password123",
      };

      axios.get.mockResolvedValue({ data: [mockUser] });

      // *測試*
      await expect(
        axiosLoginApiCall({
          email: "test@example.com",
          password: "wrongPassword",
        })
      ).rejects.toThrow("密碼不一致");
    });
  });

  describe("axiosRegisterApiCall", () => {
    it("註冊成功：當 email 未被使用時，應建立並回傳新用戶", async () => {
      const newUser = { email: "new@example.com", password: "newPassword" };
      const createdUser = { id: 3, ...newUser };

      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockResolvedValue({ data: createdUser });

      const result = await axiosRegisterApiCall(newUser);

      // *測試* 傳回來的值應為createdUser
      expect(result).toEqual(createdUser);

      // *測試* 請求網址是否正確
      expect(axios.get).toHaveBeenCalledWith(
        "/api/users?email=new@example.com"
      );

      // *測試* 確保 POST 的網址是否正確
      expect(axios.post).toHaveBeenCalledWith("/api/users", newUser);
    });

    it("註冊失敗：當 email 已經註冊時，應該拋出錯誤且不呼叫post", async () => {
      const existingUser = {
        id: 1,
        email: "test@example.com",
        password: "Password123",
      };

      axios.get.mockResolvedValue({ data: [existingUser] });

      // *測試* 是否會報錯
      await expect(
        axiosRegisterApiCall({
          email: "test@example.com",
          password: "newPassword",
        })
      ).rejects.toThrow("此電子郵件已被註冊");

      // *測試* 確保不會 POST
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
