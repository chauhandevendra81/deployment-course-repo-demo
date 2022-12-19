import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/cRUDcomponent.getAccounts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'text',
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        editable: true,
    }, {
        label: 'Industry',
        fieldName: 'Industry',
        type: 'text',
        editable: true,
    }, {
        label: 'Type',
        fieldName: 'Type',
        type: 'text',
        editable: true
    }, {
        label: 'Description',
        fieldName: 'Type',
        type: 'text',
        editable: true
    }
    
];
export default class CRUDcomponent extends LightningElement 
{
    columns = columns;
    @track accObj;
    fieldsItemValues = [];

    @wire(getAccounts)
    cons(result)
    {
        this.accObj = result;
        if (result.error) {
            this.accObj = undefined;
        }
    };

    saveHandleAction(event) {
        this.fieldsItemValues = event.detail.draftValues;
        const inputsItems = this.fieldsItemValues.slice().map(draft => 
        {
            const fields = Object.assign({}, draft);
            return { fields };
        });

       
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res =>
         {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
         );
            this.fieldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fieldsItemValues = [];
        });
    }

   
    async refresh() {
        await refreshApex(this.accObj);
    }
}