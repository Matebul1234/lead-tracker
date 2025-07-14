// src/service/CustomerService.js
export const CustomerService = {
  getData() {
    return [
      {
        id: 1000,
        name: 'James Butt',
        country: { name: 'Algeria', code: 'dz' },
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'unqualified',
        verified: true,
        activity: 17,
        representative: { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        balance: 70663
      },
      {
        id: 1020,
        name: 'Bette Nicka',
        country: { name: 'Paraguay', code: 'py' },
        company: 'Sport En Art',
        date: '2016-10-21',
        status: 'renewal',
        verified: false,
        activity: 100,
        representative: { name: 'Onyama Limba', image: 'onyamalimba.png' },
        balance: 4609
      },
      {
        id: 1476,
        name: 'Glory Schieler',
        country: { name: 'Italy', code: 'it' },
        company: 'Mcgraths Seafood',
        date: '2017-05-13',
        status: 'proposal',
        verified: true,
        activity: 34,
        representative: { name: 'Anna Fali', image: 'annafali.png' },
        balance: 96252
      },
      {
        id: 1499,
        name: 'Chauncey Motley',
        country: { name: 'Argentina', code: 'ar' },
        company: 'Affiliated With Travelodge',
        date: '2019-04-23',
        status: 'renewal',
        verified: true,
        activity: 42,
        representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
        balance: 88090
      }
    ];
  },

  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },

  getCustomersMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  },

  getCustomersXLarge() {
    return Promise.resolve(this.getData());
  },

  getCustomers(params) {
    const queryParams = params
      ? Object.keys(params)
          .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
          .join('&')
      : '';

    return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
  }
};
