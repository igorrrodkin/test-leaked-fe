import React from 'react';
import styled from 'styled-components';

import SettingsOption from '@/components/Settings/Preferences/SettingsOption';

import { EmailPreference } from '@/store/reducers/user';

interface Props {
  emailSettings: { [key in EmailPreference]: boolean };
  setChanges: (key: EmailPreference, status: boolean) => void
}

const EmailSettingsText: { [key in EmailPreference]: string } = {
  [EmailPreference.AlwaysEmailCompletedOrders]:
  'Email - Always email completed Orders',
  // [EmailPreference.AlwaysSendAttachmentsAsPDF]:
  //   'Email - Always send attachments as PDF',
  // [EmailPreference.MergeAttachmentsIntoSinglePDF]:
  //   'Email - Merge attachments into a single PDF',
  // [EmailPreference.OnlySendComprehensiveSummaryAttachment]:
  //   'Only send comprehensive summary attachment',
  // [EmailPreference.SendSettlementOrders]: 'Email - Send Settlement Orders',
  // [EmailPreference.SendOrderCommentUpdates]:
  //   'Email - Send order comment updates',
  // [EmailPreference.SendManualOrders]: 'Email - Send Manual Orders',
  // [EmailPreference.AlwaysSendAttachmentsAsPDFVICTitleSearch]:
  //   'Email - Always send attachments as PDF - VIC: Title Search',
  // [EmailPreference.AlwaysSendAttachmentsAsPDFVICCertificate]:
  //   'Email - Always send attachments as PDF - VIC: Certificate',
  // [EmailPreference.GroupOrdersIntoSingleEmailVICPackageOrder]:
  //   'Email - Group orders into a single email - VIC: Package Order',
  // [EmailPreference.GroupOrdersIntoSingleEmailVICPropertyLookup]:
  //   'Email - Group orders into a single email - VIC: Property Lookup',
  // [EmailPreference.GroupOrdersIntoSingleEmailVICPropertyEnquiry]:
  //   'Email - Group orders into a single email - VIC: Property Enquiry',
  // [EmailPreference.GroupOrdersIntoSingleEmailPPSROrganisationGrantorSearch]:
  //   'Email - Group orders into a single email - PPSR: Organisation Grantor Search',
  // [EmailPreference.GroupOrdersIntoSingleEmailPPSRIndividualGrantorSearch]:
  //   'Email - Group orders into a single email - PPSR: Individual Grantor Search',
};

const EmailPreferences: React.FC<Props> = ({
  emailSettings,
  setChanges,
}) => {
  const handleSetIsActive = (key: EmailPreference) => (status: boolean) => {
    setChanges(key, status);
  };

  return (
    <EmailPreferencesStyled>
      {Object.values(EmailPreference).map((key) => (
        <SettingsOption key={key} isActive={(emailSettings || {})[key] || false} setIsActive={handleSetIsActive(key as EmailPreference)}>
          {EmailSettingsText[key]}
        </SettingsOption>
      ))}
    </EmailPreferencesStyled>
  );
};

const EmailPreferencesStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

export default EmailPreferences;
