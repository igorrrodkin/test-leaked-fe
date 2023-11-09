import { IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';

interface IOrderItem {
  meta: any,
  region: ExistingRegions,
}

export default (
  orderItems: IOrderItem,
  pricePerItem: string,
  identifier: string,
  searchDescription: string,
  additional: {
    pageIndex?: number,
    searchCriteria?: Object,
    productId?: string,
  } = {},
): IFoundedItems[] => {
  const { meta, region } = orderItems;

  if (!meta || !orderItems) return [];

  if (meta.isError) throw new Error('400');
  if (meta.status === 404) throw new Error('404');

  const { pageIndex, searchCriteria, productId } = additional;

  const getTitles = {
    SA: {
      HTVFS: () => {
        const {
          volumeFolio, status, planParcels, addressForNotices,
        } = meta.data;
        const id = `${volumeFolio.volFolPrefix}${volumeFolio.volume}/${volumeFolio.folio}${Math.random()}`;

        return [{
          id,
          address: addressForNotices.otherLine1 || '',
          volumeFolio: `${volumeFolio.volFolPrefix}${volumeFolio.volume}/${volumeFolio.folio}`,
          volume: volumeFolio.volume,
          folio: volumeFolio.folio,
          volumeFolioPrefix: volumeFolio.volFolPrefix,
          planParcels: `${planParcels[0].planType}${planParcels[0].planNumber}`,
          price: pricePerItem,
          status,
          identifier,
          render: {
            searchedBy: 'Volume/Folio',
          },
        }];
      },
      HTAS: () => {
        const metaData = meta.data.titleReferenceSearchResults;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const address = el.propertyAddresses[0];
          const streetNumber = address.streetNumber ? `${address.streetNumber} ` : '';
          const street = address.street ? `${address.street} ` : '';
          const streetType = address.streetType ? `${address.streetType} ` : '';
          const locality = address.locality ? `${address.locality} ` : '';
          const state = address.state ? `${address.state} ` : '';
          const postcode = address.postcode ? `${address.postcode} ` : '';
          const country = address.country ? `${address.country} ` : '';
          const addressText = `${streetNumber}${street}${streetType}${locality}${state}${postcode}${country}`;
          const volumeFolio = `${el.volumeFolio.volFolPrefix}${el.volumeFolio.volume}/${el.volumeFolio.folio}`;
          const id = `${volumeFolio}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: volumeFolio,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            pageIndex,
            inputs: {
              volumeFolio,
            },
            render: {
              volumeFolio,
              planParcels: `${el.planParcels[0].planType}${el.planParcels[0].planNumber}`,
              address: el.propertyLocations[0],
              valuations: el.valuations[0]?.valuationNumber || '',
              status: el.status === 'CURRENT' ? 'OK' : (el.status || ''),
              searchedBy: 'Address',
            },
          };

          if (i === 0 && searchCriteria) {
            result.searchCriteria = searchCriteria;
          }

          return result;
        });
      },
      HTPPS: () => {
        const metaData = meta.data.titleReferenceSearchResults;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const address = el.propertyAddresses.map((item: any) => {
            const streetNumber = item.streetNumber ? `${item.streetNumber}` : '';
            const streetNumberTo = item.streetNumberTo ? `-${item.streetNumberTo}` : '';
            const street = item.street ? `${streetNumber || streetNumberTo ? ' ' : ''}${item.street} ` : '';
            const streetType = item.streetType ? `${item.streetType}, ` : '';
            const locality = item.locality ? `${item.locality}, ` : '';
            const state = item.state ? `${item.state} ` : '';
            const postcode = item.postcode ? `${item.postcode} ` : '';
            const country = item.country ? `${item.country} ` : '';
            return `${streetNumber}${streetNumberTo}${street}${streetType}${locality}${state}${postcode}${country}`;
          }).join('\n');
          const volumeFolio = `${el.volumeFolio.volFolPrefix}${el.volumeFolio.volume}/${el.volumeFolio.folio}`;
          const id = `${el.volumeFolio.volFolPrefix}${el.volumeFolio.volume}/${el.volumeFolio.folio}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: volumeFolio,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            pageIndex,
            inputs: {
              volumeFolio,
            },
            render: {
              volumeFolio,
              planParcels: `${el.planParcels[0].planType}${el.planParcels[0].planNumber}`,
              address,
              valuations: el.valuations ? el.valuations.map((item: any) => item?.valuationNumber || '').join('\n') : '',
              status: el.status,
              searchedBy: 'Plan/Parcel',
            },
          };

          if (i === 0 && searchCriteria) {
            result.searchCriteria = searchCriteria;
          }

          return result;
        });
      },
      HTONSS: () => {
        const metaData = meta.data.ownerships;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const volumeFolio = `${el.volumeFolio.volFolPrefix}${el.volumeFolio.volume}/${el.volumeFolio.folio}`;
          const streetNumber = el.propertyLocation.streetNumber || '';
          const street = el.propertyLocation.street || '';
          const locality = el.propertyLocation.locality || '';
          const propertyLocation = `${streetNumber} ${street} ${locality}`.trim();
          const id = `${volumeFolio}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: volumeFolio,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            pageIndex,
            inputs: {
              volumeFolio,
            },
            render: {
              volumeFolio,
              ownershipNumber: el.ownershipNumber,
              numberOfOwners: el.numberOfOwners,
              status: el.status,
              estateType: el.estateType,
              propertyLocation,
              searchedBy: 'Owner (Individual)',
            },
          };

          return result;
        });
      },
      HTLBOS: () => {
        const metaData = meta.data.ownerships;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const volumeFolio = `${el.volumeFolio.volFolPrefix}${el.volumeFolio.volume}/${el.volumeFolio.folio}`;
          const streetNumber = el.propertyLocation.streetNumber || '';
          const street = el.propertyLocation.street || '';
          const locality = el.propertyLocation.locality || '';
          const propertyLocation = `${streetNumber} ${street} ${locality}`.trim();
          const id = `${volumeFolio}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: volumeFolio,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            pageIndex,
            inputs: {
              volumeFolio,
            },
            render: {
              volumeFolio,
              ownershipNumber: el.ownershipNumber,
              numberOfOwners: el.numberOfOwners,
              status: el.status,
              estateType: el.estateType,
              propertyLocation,
              searchedBy: 'Owner (Organisation)',
            },
          };

          return result;
        });
      },
    },
    WA: {
      HTTRW: () => {
        const metaData = meta.data.titles;

        return metaData.map((el: any, i: number) => {
          const id = `${el.titleDetails.identifier}${i}`;

          const result: IFoundedItems = {
            id,
            description: el.titleDetails.identifier,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: productId || '',
            isChosen: true,
            searchDescription,
            inputs: {
              titleReference: el.titleDetails.identifier,
            },
            render: {
              titleReference: el.titleDetails.identifier,
              information: 'Verified',
            },
          };

          return result;
        });
      },
      HTAW: () => {
        const metaData = meta.data.addresses;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const waTitleSearchProduct = getRegionsData()
          .find((config) => config.region === ExistingRegions.WA)
          ?.services[0]!;

        return metaData.map((el: any, i: number) => {
          const { address } = el;
          const titleRef = el.titleReference.replaceAll('-', '/');
          const number = address.number ? `${address.number} ` : '';
          const street = address.street ? `${address.street} ` : '';
          const streetType = address.streetType ? `${address.streetType} ` : '';
          const locality = address.locality ? `${address.locality} ` : '';
          const addressText = `${number}${street}${streetType}${locality}`;
          const lot = el.lotPlan.lot ? `${el.lotPlan.lot}/` : '';
          const lotPlan = `${lot}${el.lotPlan.planType}${el.lotPlan.planNumber}`;
          const id = `${titleRef}${i}`;

          const result: IFoundedItems = {
            id,
            description: addressText,
            identifier,
            verificationIdentifier: waTitleSearchProduct.identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: waTitleSearchProduct.productId || '',
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference: titleRef,
            },
            render: {
              titleReference: titleRef,
              address: addressText,
              lotPlan,
            },
          };

          return result;
        });
      },
      HTOIW: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const waTitleSearchProduct = getRegionsData()
          .find((config) => config.region === ExistingRegions.WA)
          ?.services[0]!;

        return metaData.map((el: any, i: number) => {
          const { realProperty } = el;
          const { individual } = el;
          const titleRef = realProperty.titleReferences[0].replaceAll('-', '/');
          const description = `${individual.surname}, ${individual.givenNames}`;
          const id = `${titleRef}${individual.givenNames}${i}`;

          const result: IFoundedItems = {
            id,
            description,
            identifier,
            verificationIdentifier: waTitleSearchProduct.identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: waTitleSearchProduct.productId,
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference: titleRef,
            },
            render: {
              titleReference: titleRef,
              surname: individual.surname,
              givenNames: individual.givenNames,
              status: el.status,
            },
          };

          return result;
        });
      },
      HTOOW: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const waTitleSearchProduct = getRegionsData()
          .find((config) => config.region === ExistingRegions.WA)
          ?.services[0]!;

        return metaData.map((el: any, i: number) => {
          const { realProperty } = el;
          const { organisationName } = el;
          const titleRef = realProperty.titleReferences[0].replaceAll('-', '/');
          const description = organisationName.name;
          const id = `${titleRef}${organisationName.name}${i}`;

          const result: IFoundedItems = {
            id,
            description,
            identifier,
            verificationIdentifier: waTitleSearchProduct.identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: waTitleSearchProduct.productId,
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference: titleRef,
            },
            render: {
              titleReference: titleRef,
              orgName: organisationName.name,
              status: el.status,
            },
          };

          return result;
        });
      },
    },
    NSW: {
      HTTRN: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const id = `${el.realProperty.titleReferences[0]}${i}`;
          const council = el.realProperty.localAuthority || '';
          const county = el.realProperty.address.county || '';
          const parish = el.realProperty.address.parish || '';

          const result: IFoundedItems = {
            id,
            description: el.realProperty.titleReferences[0],
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: productId || '',
            isChosen: !!productId,
            searchDescription,
            inputs: {
              titleReference: el.realProperty.titleReferences[0],
            },
            render: {
              titleReference: el.realProperty.titleReferences[0],
              council,
              parish,
              county,
            },
          };

          return result;
        });
      },
      HTAN: () => {
        const metaData = meta.data.addresses;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const nswTitleSearchProduct = getRegionsData()
          .find((config) => config.region === ExistingRegions.NSW)
          ?.services[0];

        return metaData.map((el: any, i: number) => {
          const { address } = el;
          const number = address.number ? `${address.number} ` : '';
          const street = address.street ? `${address.street} ` : '';
          const locality = address.locality ? `${address.locality} ` : '';
          const country = address.country ? `${address.country} ` : '';
          const postcode = address.postcode ? `${address.postcode} ` : '';
          const streetType = address.streetType ? `${address.streetType} ` : '';
          const addressText = `${number}${street}${streetType}${locality}${country}${postcode}`;
          const id = `${el.titleReference}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: el.titleReference,
            identifier,
            verificationIdentifier: nswTitleSearchProduct!.identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: nswTitleSearchProduct!.productId || '',
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference: el.titleReference,
            },
            render: {
              titleReference: el.titleReference,
              address: addressText,
            },
          };

          return result;
        });
      },
    },
    VIC: {
      HTAV: () => {
        const metaData = meta.data.browsedProperties;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const titleReference = el.titleReference || `${el.volumeFolio.volume}/${el.volumeFolio.folio}`;
          const id = `${el.volumeFolio?.volume}/${el.volumeFolio?.folio}${Math.random()}${i}`;

          const result: IFoundedItems = {
            id,
            description: titleReference,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference,
            },
            render: {
              titleReference,
              type: 'Title Search',
              address: el.address,
              councilNumber: el.councilNumber,
              landDescription: el.landDescription,
              municipality: el.town,
              parish: el.structuredAddress.parish || '',
              status: el.status,
            },
          };

          return result;
        });
      },
      HTLPV: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const result = metaData.map(({ realProperty }: any) => {
          const { volumeFolios } = realProperty;

          return volumeFolios.map((el: any, i: number) => {
            const volumeFolio = `${el.volume}/${el.folio}`;
            const id = `${realProperty.name}${Math.random()}${i}`;

            const item: IFoundedItems = {
              id,
              description: volumeFolio,
              identifier,
              price: pricePerItem,
              type: FullfilmentType.AUTO,
              productId: '',
              isChosen: false,
              searchDescription,
              inputs: {
                titleReference: volumeFolio,
              },
              render: {
                titleReference: volumeFolio,
                type: 'Title Search',
                address: realProperty.name,
                municipality: realProperty.address.town,
                parish: realProperty.address.parish || '',
                councilNumber: '',
                status: realProperty.status,
              },
            };

            return item;
          });
        });

        return result.flat();
      },
      HTTRV: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        const result = metaData.map(({ realProperty }: any) => {
          const { address, volumeFolios } = realProperty;

          return volumeFolios.map((el: any, i: number) => {
            const volumeFolio = `${el.volume}/${el.folio}`;
            const id = `${realProperty.name}${Math.random()}${i}`;

            const item: IFoundedItems = {
              id,
              description: volumeFolio,
              identifier,
              price: pricePerItem,
              type: FullfilmentType.AUTO,
              productId: '',
              isChosen: false,
              searchDescription,
              inputs: {
                titleReference: volumeFolio,
              },
              render: {
                titleReference: volumeFolio,
                type: 'Title Search',
                information: 'Verified',
                municipality: address.locality || '',
                parish: address.parish || '',

                address: realProperty.name,
                councilNumber: '',
                status: realProperty.status,
              },
            };

            return item;
          });
        });

        return result[0];
      },
    },
    QLD: {
      HTAQ: () => {
        const metaData = meta.data.addresses;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const lotPlan = `${el.lotPlan.lot}/${el.lotPlan.planType}${el.lotPlan.planNumber}`;
          const { address } = el;
          const unit = address.unit ? `${address.unit} / ` : '';
          const number = address.number ? `${address.number} ` : '';
          const street = address.street ? `${address.street} ` : '';
          const streetType = address.streetType ? `${address.streetType} ` : '';
          const locality = address.locality ? `${address.locality} ` : '';
          const state = address.state ? `${address.state} ` : '';
          const postcode = address.postcode ? `${address.postcode} ` : '';
          const country = address.country ? `${address.country} ` : '';
          const addressText = `${unit}${number}${street}${streetType}${locality}${state}${postcode}${country}`;
          const id = lotPlan + Math.random() + i;
          const buildingName = address.buildingName ? `${address.buildingName}` : '';

          const result: IFoundedItems = {
            id,
            description: lotPlan,
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            inputs: {
              lot: el.lotPlan.lot,
              plan: el.lotPlan.planNumber,
              planType: el.lotPlan.planType,
            },
            render: {
              lotPlan,
              address: `${buildingName} ${addressText}`,
              status: el.status || '',
            },
          };

          return result;
        });
      },
      HTOIQ: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const { realProperty } = el;
          const { individual } = el;
          const itemName = `${individual.surname}, ${individual.givenNames}`;
          const id = realProperty.titleReferences[0] + individual.givenNames + Math.random() + i;

          const result: IFoundedItems = {
            id,
            description: realProperty.titleReferences[0],
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            isUnable: false,
            searchDescription,
            inputs: {
              titleReference: realProperty.titleReferences[0],
            },
            render: {
              titleReference: realProperty.titleReferences[0],
              titleType: realProperty.propertyType || '',
              surname: individual.surname,
              givenNames: individual.givenNames,
              status: el.status || '',
              lotPlan: '',
              itemName,
            },
          };

          return result;
        });
      },
      HTOOQ: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('404');
        }

        return metaData.map((el: any, i: number) => {
          const { realProperty } = el;
          const { organisationName } = el;
          const id = realProperty.titleReferences[0] + organisationName.name + Math.random() + i;

          const result: IFoundedItems = {
            id,
            description: realProperty.titleReferences[0],
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            isUnable: false,
            searchDescription,
            inputs: {
              titleReference: realProperty.titleReferences[0],
            },
            render: {
              titleReference: realProperty.titleReferences[0],
              titleType: realProperty.propertyType || '',
              surname: organisationName.name,
              givenNames: '',
              status: el.status || '',
              lotPlan: '',
              orgName: organisationName.name,
              itemName: organisationName.name,
            },
          };

          return result;
        });
      },
      HTLPQ: () => {
        const metaData = meta.data.titles;

        if (!metaData?.length) {
          throw new Error('Verification failed');
        }

        return metaData.map((el: any, i: number) => {
          const { realProperty } = el;
          const lp = el.realProperty.lotPlans[0];
          const itemName = realProperty.name || '';
          const { lot } = lp;
          const { planType } = lp;
          const { planNumber } = lp;
          const lotPlan = `${lot}${planType}${planNumber}`;
          const id = realProperty.titleReferences[0] + Math.random() + i;

          const result: IFoundedItems = {
            id,
            description: realProperty.titleReferences[0],
            identifier,
            price: pricePerItem,
            type: FullfilmentType.AUTO,
            productId: '',
            isChosen: false,
            searchDescription,
            inputs: {
              titleReference: realProperty.titleReferences[0],
            },
            render: {
              titleReference: realProperty.titleReferences[0],
              titleType: realProperty.propertyType,
              status: '',
              itemName,
              lotPlan,
              lot,
              planType,
              planNumber,
            },
          };

          return result;
        });
      },
    },
  };

  return getTitles[region][identifier]();
};
