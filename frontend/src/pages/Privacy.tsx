import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';

import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

const Privacy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <ArrowBackIcon
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (location.key === 'default') {
              navigate('/dashboard/matters');
            } else {
              navigate(-1);
            }
          }}
        />
        <PageTitle marginBottom="0">Privacy Policy</PageTitle>
      </PageHeader>

      <Content>
        <P>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from
          app.altscorp.com.au (the “Site”).
        </P>

        <Header>PERSONAL INFORMATION WE COLLECT</Header>

        <P>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the Site, and information
          about how you interact with the Site. We refer to this
          automatically-collected information as “Device Information.”
        </P>

        <P>
          We collect Device Information using the following technologies:
          <List>
            <Li>
              “Cookies” are data files that are placed on your device or
              computer and often include an anonymous unique identifier. For
              more information about cookies, and how to disable cookies, visit
              {' '}
              <a
                href="http://www.allaboutcookies.org"
                target="_blank"
                rel="noreferrer"
              >
                http://www.allaboutcookies.org
              </a>
              .
            </Li>
            <Li>
              “Log files” track actions occurring on the Site, and collect data
              including your IP address, browser type, Internet service
              provider, referring/exit pages, and date/time stamps.
            </Li>
            <Li>
              “Web beacons,” “tags,” and “pixels” are electronic files used to
              record information about how you browse the Site.
            </Li>
          </List>
        </P>

        <P>
          Additionally when you make a purchase or attempt to make a purchase
          through the Site, we collect certain information from you, including
          your name, billing address, shipping address, payment information
          (including credit card numbers, paypal email address, and phone
          number. We refer to this information as “Order Information.”
        </P>

        <P>
          When we talk about “Personal Information” in this Privacy Policy, we
          are talking both about Device Information and Order Information.
        </P>

        <P>
          The purposes for which we collect, hold, use and disclose personal
          information.
        </P>

        <P>
          We collect, hold, use and disclose personal information for a variety
          of business purposes including:
          <List>
            <Li>
              to provide the products or services you have requested from us;
            </Li>
            <Li>to process payments;</Li>
            <Li>to improve our business, products and services;</Li>
            <Li>to promote our business to you;</Li>
            <Li>to market other ALTS services or products to you;</Li>
            <Li>
              to handle and respond to your enquiries, complaints or concerns;
              and
            </Li>
            <Li>
              to provide personal information to third parties as set out in
              this Privacy Policy.
            </Li>
          </List>
        </P>

        <Header>Direct marketing</Header>

        <P>
          We also collect, hold, use and disclose your personal information to:
          <List>
            <Li>
              notify you about the details of new services and products offered
              by us;
            </Li>
            <Li>
              notify you of the details of meetings, events and seminars that
              may be of interest to ALTS customers and clients;
            </Li>
            <Li>send you our newsletters and other marketing publications;</Li>
            <Li>
              administer our databases for client service, marketing and
              financial accounting purposes; and • to comply with our legal
              requirements regarding the collection and retention of information
              concerning the products and services that we provide.
            </Li>
          </List>
        </P>

        <P>
          If you do not wish to disclose your personal information for the
          purpose of direct marketing or you would like to opt-out of receiving
          direct marketing communications, you can do so by contacting ALTS CORP
          using the contact details set
        </P>

        <Header>HOW DO WE USE YOUR PERSONAL INFORMATION?</Header>

        <P>
          We use the Order Information that we collect generally to fulfill any
          orders placed through the Site (including processing your payment
          information, arranging for shipping, and providing you with invoices
          and/or order confirmations). Additionally, we use this Order
          Information to:
          <Span>Communicate with you;</Span>
          <Span>Screen our orders for potential risk or fraud; and</Span>
          <Span>
            When in line with the preferences you have shared with us, provide
            you with information or advertising relating to our products or
            services.
          </Span>
        </P>

        <P>
          We use the Device Information that we collect to help us screen for
          potential risk and fraud (in particular, your IP address), and more
          generally to improve and optimize our Site (for example, by generating
          analytics about how our customers browse and interact with the Site,
          and to assess the success of our marketing and advertising campaigns).
        </P>

        <Header>SHARING YOUR PERSONAL INFORMATION</Header>

        <P>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. We use Google Analytics
          to help us understand how our customers use the Site--you can read
          more about how Google uses your Personal Information here:
          {' '}
          <a
            href="https://www.google.com/intl/en/policies/privacy/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.google.com/intl/en/policies/privacy/
          </a>
          . You can also opt-out of Google Analytics here:
          {' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noreferrer"
          >
            https://tools.google.com/dlpage/gaoptout
          </a>
          .
        </P>

        <P>
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </P>

        <Header>BEHAVIOURAL ADVERTISING</Header>

        <P>
          As described above, we use your Personal Information to provide you
          with targeted advertisements or marketing communications we believe
          may be of interest to you. For more information about how targeted
          advertising works, you can visit the Network Advertising Initiative’s
          (“NAI”) educational page at
          {' '}
          <a
            href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work"
            target="_blank"
            rel="noreferrer"
          >
            http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work
          </a>
          .
        </P>

        <P>
          You can opt out of targeted advertising by:
          <List>
            <Li>
              FACEBOOK -
              {' '}
              <a
                href="https://www.facebook.com/settings/?tab=ads"
                target="_blank"
                rel="noreferrer"
              >
                https://www.facebook.com/settings/?tab=ads
              </a>
            </Li>
            <Li>
              GOOGLE -
              {' '}
              <a
                href="https://www.google.com/settings/ads/anonymous"
                target="_blank"
                rel="noreferrer"
              >
                https://www.google.com/settings/ads/anonymous
              </a>
            </Li>
            <Li>
              BING -
              {' '}
              <a
                href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads"
                target="_blank"
                rel="noreferrer"
              >
                https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads
              </a>
            </Li>
          </List>
        </P>

        <P>
          Additionally, you can opt out of some of these services by visiting
          the Digital Advertising Alliance’s opt-out portal at:
          {' '}
          <a
            href="http://optout.aboutads.info/"
            target="_blank"
            rel="noreferrer"
          >
            http://optout.aboutads.info/
          </a>
          .
        </P>

        <Header>DO NOT TRACK</Header>

        <P>
          Please note that we do not alter our Site’s data collection and use
          practices when we see a Do Not Track signal from your browser.
        </P>

        <Header>YOUR RIGHTS</Header>

        <P>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below.
        </P>

        <P>
          Additionally, if you are a European resident we note that we are
          processing your information in order to fulfill contracts we might
          have with you (for example if you make an order through the Site), or
          otherwise to pursue our legitimate business interests listed above.
          Additionally, please note that your information will be transferred
          outside of Europe, including to Canada and the United States.
        </P>

        <Header>DATA RETENTION</Header>

        <P>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </P>

        <Header>MINORS</Header>

        <P>The Site is not intended for individuals under the age of 18.</P>

        <Header>CHANGES</Header>

        <P>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </P>

        <Header>CONTACT US</Header>

        <P>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at
          {' '}
          <a href="mailto:legal@altscorp.com.au">legal@altscorp.com.au</a>
          .
        </P>
      </Content>
    </PageContainer>
  );
};

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 24px;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);

  svg {
    cursor: pointer;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0 32px;

  a {
    transition: all 0.3s ease;
    color: #0000ff;

    &:hover {
      opacity: 0.5;
    }
  }
`;

const Header = styled.h3`
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #1a1c1e;
  margin: 32px 0 10px;
`;
const P = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 200%;
  letter-spacing: -0.03em;
  color: #6c7278;
  margin: 10px 0 20px;
`;

const List = styled.ul``;
const Li = styled.li`
  font-weight: 500;
  font-size: 16px;
  line-height: 200%;
  letter-spacing: -0.03em;
  color: #6c7278;
  padding: 0 0 0 20px;

  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 13px;
    left: 5px;
    width: 4px;
    height: 4px;
    background: #6c7278;
    border-radius: 50%;
    overflow: hidden;
  }
`;

const Span = styled.span`
  display: block;
  font-weight: 500;
  font-size: 16px;
  line-height: 200%;
  letter-spacing: -0.03em;
  color: #6c7278;
`;
export default Privacy;
