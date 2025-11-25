import { APIRequestContext, request, expect } from '@playwright/test';

export class ApiPage {
  readonly api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  static async create() {
    const api = await request.newContext({
      baseURL: "https://hoff.is/store2/api/"
    });
    return new ApiPage(api);
  }

  async listProducts() {
    const res = await this.api.get("v1/product/list");
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async getProductPrice(id: string | number) {
    const res = await this.api.get(`v1/price/${id}`);
    expect(res.ok()).toBeTruthy();
    return res.json();
  }
}
