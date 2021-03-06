import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SocketService } from './socket.service';
import { AccountService } from './account.service';
import { OrderBookModule } from './order-book/order-book.module';
import { OrderEntryModule } from './order-entry/order-entry.module';
import { AccountSelectorModule } from './account-selector/account-selector.module';
import { OrderDepthModule } from './order-depth/order-depth.module';
import { TradeHistoryModule } from './trade-history/trade-history.module';
import { OrderDepthChartModule } from './order-depth-chart/order-depth-chart.module';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule, OrderEntryModule, OrderBookModule, OrderDepthModule,
        AccountSelectorModule, TradeHistoryModule, OrderDepthChartModule],
    providers: [SocketService, AccountService]
})
export class AppModule {}
