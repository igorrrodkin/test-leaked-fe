import { IVerifiedItem } from '@/store/reducers/order';

interface IExtra {
  matter?: string;
  searchCriteria?: { [p in string]: string };
}

export default (data: any, region: string, identifier: string, extra: IExtra, pageIndex = 0): IVerifiedItem[] => {
  if (!data) return [];

  const getTitles = {
    VIC: {
      HTAV1: (): IVerifiedItem[] => {
        const { addresses } = data;

        if (!addresses.length) {
          throw new Error('404');
        }

        return addresses.map((el: any, i: number) => {
          const result: IVerifiedItem = {
            id: el.link + i,
            identifier: 'HTAV',
            description: el.addressTitle,
            render: {
              link: el.link,
              address: el.addressTitle,
            },
            inputs: {
              link: el.link,
            },
          };

          return result;
        });
      },
    },
    SA: {
      HTONSS1: () => {
        const { ownerNameSearchResults } = data;

        if (!ownerNameSearchResults.length || !extra.matter) {
          throw new Error('404');
        }

        return ownerNameSearchResults.map((el: any, i: number) => {
          const description = `${el.ownerName}`;

          const result: IVerifiedItem = {
            id: el.ownerName + i,
            identifier: 'HTLBOS',
            description,
            pageIndex,
            render: {
              orgOrSurname: el.orgOrSurname || '',
              ownerName: el.ownerName || '',
              givenNames: el.givenNames || '',
              capacity: el.capacity,
              acn: el.acn || '',
            },
            inputs: {
              matterReference: extra.matter!,
            },
          };

          if (i === 0 && extra.searchCriteria) {
            result.searchCriteria = extra.searchCriteria;
          }

          if (el.acn) {
            result.inputs.acn = el.acn;
          }

          if (el.orgOrSurname) {
            result.inputs.orgOrSurname = el.orgOrSurname;
          } else {
            result.inputs = {};
          }

          return result;
        });
      },
    },
  };

  return getTitles[region][identifier]();
};
