public with sharing class ManageRecordsController {  
    @AuraEnabled(cacheable = true)  
    public static List<BankAccount__c> getAccountsList(Integer pagenumber, Integer numberOfRecords, Integer pageSize, String searchString) {  
      String searchKey = '%' + searchString + '%';  
      String query = 'SELECT Id, Name, 	Name__c, Account_Type__c, Mobile_Number__c FROM BankAccount__c ';  
      if (searchString != null && searchString != '') {  
        query += ' where 	Name__c like \'%' + searchString + '%\' ';  
      }  
      query += ' limit ' + pageSize + ' offset ' + (pageSize * (pagenumber - 1));  
      return Database.query(query);  
    }  
    @AuraEnabled(cacheable = true)  
    public static Integer getAccountsCount(String searchString) {  
      String query = 'select count() from BankAccount__c ';  
      if (searchString != null && searchString != '') {  
        query += ' where 	Name__c like \'%' + searchString + '%\' ';  
      }  
      return Database.countQuery(query);  
    }  
  }  