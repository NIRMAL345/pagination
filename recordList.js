import { LightningElement, track, api } from 'lwc';  
 import getAccountsList from '@salesforce/apex/ManageRecordsController.getAccountsList';  
 import getAccountsCount from '@salesforce/apex/ManageRecordsController.getAccountsCount';  
 
 export default class recordList extends LightningElement {  
   @track bankaccounts;  
   @track error;  
   @api currentpage;  
   @api pagesize;  
   @track searchKey;  
   totalpages;  
   localCurrentPage = null;  
   isSearchChangeExecuted = false;  
   // not yet implemented  
   pageSizeOptions =  
     [  
       { label: '5', value: 5 },  
       { label: '10', value: 10 },  
       { label: '25', value: 25 },  
       { label: '50', value: 50 },  
       { label: 'All', value: '' },  
     ];  
   handleKeyChange(event) {  
     if (this.searchKey !== event.target.value) {  
       this.isSearchChangeExecuted = false;  
       this.searchKey = event.target.value;  
       this.currentpage = 1;  
     }  
   }  
   renderedCallback() {  
     // This line added to avoid duplicate/multiple executions of this code.  
     if (this.isSearchChangeExecuted && (this.localCurrentPage === this.currentpage)) {  
       return;  
     }  
     this.isSearchChangeExecuted = true;  
     this.localCurrentPage = this.currentpage;  
     getAccountsCount({ searchString: this.searchKey })  
       .then(recordsCount => {  
         this.totalrecords = recordsCount;  
         if (recordsCount !== 0 && !isNaN(recordsCount)) {  
           this.totalpages = Math.ceil(recordsCount / this.pagesize);  
           getAccountsList({ pagenumber: this.currentpage, numberOfRecords: recordsCount, pageSize: this.pagesize, searchString: this.searchKey })  
             .then(accountList => {  
               this.bankaccounts = accountList;  
               this.error = undefined;  
             })  
             .catch(error => {  
               this.error = error;  
               this.bankaccounts = undefined;  
             });  
         } else {  
           this.bankaccounts = [];  
           this.totalpages = 1;  
           this.totalrecords = 0;  
         }  
         const event = new CustomEvent('recordsload', {  
           detail: recordsCount  
         });  
         this.dispatchEvent(event);  
       })  
       .catch(error => {  
         this.error = error;  
         this.totalrecords = undefined;  
       });  
   }  
 }  