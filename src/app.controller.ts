import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AddressDTO } from './address.dto.js';

const addressRegex = /^[a-f\d]{2}:[a-f\d]{2}:[a-f\d]{2}:[a-f\d]{2}:[a-f\d]{2}:[a-f\d]{2}$/i

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  @Render('index')
  async getHello() {
    return {
      blocklist: (await this.appService.getBlocklist()).sort((a,b) => a.priority - b.priority),
      errors: []
    }
  }

  @Post()
  @Render("index")
  async felvetel(@Body() body: AddressDTO) {
    const errors = []

    if (isNaN(Number(body.priority))) {
      errors.push("Nem szám a prio");
    }

    if (!addressRegex.test(body.mac)) {
      errors.push("Nem megfelelő address");
    }

    if (errors.length == 0) {
      await this.appService.addAddress(parseInt(body.priority), body.mac, body.enabled? true:false);
    }
    
    return {
      blocklist: (await this.appService.getBlocklist()).sort((a,b) => a.priority - b.priority),
      errors: errors
    }
  }
}
