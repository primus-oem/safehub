import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('policy')
  async applyPolicy(@Body() body: { prompt: string }) {
    // Forward policy prompt to Permguard (OPA) API
    const response = await axios.post<{ result: string }>(
      process.env.PERMGUARD_URL + '/v1/data/policy',
      { input: { prompt: body.prompt } },
    );
    return { result: response.data.result };
  }
}
