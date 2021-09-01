import { message } from "antd";
import axios, { AxiosError } from 'axios';
import { AES } from "crypto-js";
import { LoginRequest, LoginResponse, SignUpRequest } from "../model";
import { IResponse, QueryParams } from "../model/api";
import storage from "./storage";
import { RootPath, SubPath } from "./api-path";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API || "http://localhost:3001/api";
  } else {
    return "https://cms.chtoma.com/api";
  }
};

const baseURL = getBaseUrl();

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: "json",
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer" + storage?.token,
      },
    };
  }
  return config;
});

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : path;

    return axiosInstance
      .get(path)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path))
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .put(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  /**
   * 根据 HTTP 状态码判断请求是否成功
   */
  protected isError(code: number): boolean {
    return !(
      code.toString().startsWith("2") || code.toString().startsWith("3")
    );
  }

  /**
   * 根据 HTTP 状态码判断请求是否成功
   */
  protected showMessage =
    (isSuccessDisplay = false) =>
    (res: IResponse): IResponse => {
      const { code, msg } = res;
      const isError = this.isError(code);

      if (isError) {
        message.error(msg);
      }

      if (isSuccessDisplay && !isError) {
        message.success(msg);
      }

      return res;
    };

  // ?? 啥意思？

  /**
   * 处理 http 请求上的错误
   * 注意：此处返回的code是HTTP的状态码，并非后台自定义的code
   */
  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response?.data.msg ?? "unknown error";
    const code = err.response?.status ?? -1;

    if (!err.response) {
      console.error(
        "%c [err]-149",
        "font-size:13px; background:pink; color:#bf2c9f;",
        err
      );
    }

    return { msg, code };
  }

  private getPath(path: IPath): string {
    return !Array.isArray(path) ? String(path) : path.join("/");
  }
}

class ApiService extends BaseApiService {
  login({password, ...rest}: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.post<IResponse<LoginRequest>>(RootPath.login, {
      ...rest,
      password: AES.encrypt(password, 'cms').toString(),
    }).then(this.showMessage());
  }

  logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(this.showMessage());
  } 

  signUp(req: SignUpRequest): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>([RootPath.signUp], req).then(this.showMessage());
  }

}


export const apiService = new ApiService();

export default apiService;