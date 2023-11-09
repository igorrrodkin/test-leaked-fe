import React, { FC } from 'react';

import CrownDescription from '@/components/AddOrder/manual/VIC/CrownDescription';

import { IOrganisationService } from '@/store/reducers/services';

interface Props {
  product: IOrganisationService,
  isLast: boolean,
}

const ManualInputs: FC<Props> = ({ product, isLast }) => {
  const getContent = () => {
    switch (product.productId) {
      case 'LANCROWN': return <CrownDescription product={product} isLast={isLast} />;
      default: return <></>;
    }
  };

  return getContent();
};

export default ManualInputs;
