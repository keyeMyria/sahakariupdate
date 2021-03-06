import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
//import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { FundTransferPage } from '../fund-transfer/fund-transfer';
import { BalanceEnquiryPage } from '../balance-enquiry/balance-enquiry';
import { MiniStatementPage } from '../mini-statement/mini-statement';
import { PagePage } from '../page/page';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-banking',
  templateUrl: 'banking.html'
})
export class BankingPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  ActiveBankName: string;
  callback: any;
  // constructor(private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
  constructor(public navParams: NavParams, private storageService: StorageService, public navCtrl: NavController) {

    //StorageService.SetItem('lastAction', Date.now().toString());

  }

  ngOnInit() {
    this.ActiveBankName = this.storageService.GetActiveBankName();
  }
  OnFundTransfer() {  //Fires, when clicking on Fund Transfer.
    var isFromFundTransfer: boolean = true;
    if (this.storageService.GetSelfCareAc() == null) {
      this.navCtrl.push(LoginPage, { 'isFromFundTransfer': isFromFundTransfer }).then(() => {
        const startIndex = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(startIndex, 1);  //removes the history of this page.
      });
    }
    else {
      this.navCtrl.push(FundTransferPage);
    }
  }
  OnBack() {
    this.navCtrl.setRoot(PagePage);
  }
  OnBalanceEnquiry() {  //Fires, when clicking on Balance Enquiry.
    var isFromBalanceEnquiry: boolean = true;
    if (this.storageService.GetSelfCareAc() == null) {
      // const startIndex = this.navCtrl.getActive().index;
      // const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.push(LoginPage, { 'isFromBalanceEnquiry': isFromBalanceEnquiry })
      // .then(() => {  
      //   this.navCtrl.remove(startIndex, 1);  //removes the history of this page.
      //   // const startIndex = this.navCtrl.getActive().index;
      //   // this.navCtrl.remove(0, startIndex);  
      // });
    }
    else {
      this.navCtrl.push(BalanceEnquiryPage);
    }
  }
  ionViewDidEnter(){
    
  }
  
  ionViewDidLoad() {
    this.setBackButtonAction()
  }
  setBackButtonAction() {  //Fires for Backbutton click
    this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(PagePage);
    }
  }
  OnMiniStatement() {   //Fires, when clicking on Mini Statement.
    var isFromMiniStatement: boolean = true;
    if (this.storageService.GetSelfCareAc() == null) {
      this.navCtrl.push(LoginPage, { 'isFromMiniStatement': isFromMiniStatement }).then(() => {
        const startIndex = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(startIndex, 1);  //removes the history of this page.
      });
    }
    else {
      this.navCtrl.push(MiniStatementPage);
    }
  }
}
