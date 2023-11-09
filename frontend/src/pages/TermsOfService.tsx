import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';

import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

const TermsOfService = () => {
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
        <PageTitle marginBottom="0">Terms of Service</PageTitle>
      </PageHeader>

      <Content>
        <Header> OVERVIEW</Header>

        <P>
          This website is operated by ALTS CORP. Throughout the site, the terms
          “we”, “us” and “our” refer to ALTS CORP. ALTS CORP offers this
          website, including all information, tools and services available from
          this site to you, the user, conditioned upon your acceptance of all
          terms, conditions, policies and notices stated here.
        </P>

        <P>
          By visiting our site and/ or purchasing something from us, you engage
          in our “Service” and agree to be bound by the following terms and
          conditions (“Terms of Service”, “Terms”), including those additional
          terms and conditions and policies referenced herein and/or available
          by hyperlink. These Terms of Service apply to all users of the site,
          including without limitation users who are browsers, vendors,
          customers, merchants, and/ or contributors of content.
        </P>

        <P>
          Please read these Terms of Service carefully before accessing or using
          our website. By accessing or using any part of the site, you agree to
          be bound by these Terms of Service. If you do not agree to all the
          terms and conditions of this agreement, then you may not access the
          website or use any services. If these Terms of Service are considered
          an offer, acceptance is expressly limited to these Terms of Service.
        </P>

        <P>
          Any new features or tools which are added to the current store shall
          also be subject to the Terms of Service. You can review the most
          current version of the Terms of Service at any time on this page. We
          reserve the right to update, change or replace any part of these Terms
          of Service by posting updates and/or changes to our website. It is
          your responsibility to check this page periodically for changes. Your
          continued use of or access to the website following the posting of any
          changes constitutes acceptance of those changes.
        </P>

        <Header>SECTION 1 - ONLINE STORE TERMS</Header>

        <P>
          By agreeing to these Terms of Service, you represent that you are at
          least the age of majority in your state or province of residence, or
          that you are the age of majority in your state or province of
          residence and you have given us your consent to allow any of your
          minor dependents to use this site.
        </P>

        <P>
          You may not use our products for any illegal or unauthorized purpose
          nor may you, in the use of the Service, violate any laws in your
          jurisdiction (including but not limited to copyright laws).
        </P>

        <P>
          You must not transmit any worms or viruses or any code of a
          destructive nature.
        </P>

        <P>
          A breach or violation of any of the Terms will result in an immediate
          termination of your Services.
        </P>

        <Header>SECTION 2 - GENERAL CONDITIONS</Header>

        <P>
          We reserve the right to refuse service to anyone for any reason at any
          time.
        </P>

        <P>
          You understand that your content (not including credit card
          information), may be transferred unencrypted and involve (a)
          transmissions over various networks; and (b) changes to conform and
          adapt to technical requirements of connecting networks or devices.
          Credit card information is always encrypted during transfer over
          networks.
        </P>

        <P>
          You agree not to reproduce, duplicate, copy, sell, resell or exploit
          any portion of the Service, use of the Service, or access to the
          Service or any contact on the website through which the service is
          provided, without express written permission by us.
        </P>

        <P>
          The headings used in this agreement are included for convenience only
          and will not limit or otherwise affect these Terms.
        </P>

        <Header>
          SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
        </Header>

        <P>
          We are not responsible if information made available on this site is
          not accurate, complete or current. The material on this site is
          provided for general information only and should not be relied upon or
          used as the sole basis for making decisions without consulting
          primary, more accurate, more complete or more timely sources of
          information. Any reliance on the material on this site is at your own
          risk.
        </P>

        <P>
          This site may contain certain historical information. Historical
          information, necessarily, is not current and is provided for your
          reference only. We reserve the right to modify the contents of this
          site at any time, but we have no obligation to update any information
          on our site. You agree that it is your responsibility to monitor
          changes to our site.
        </P>

        <Header>SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</Header>

        <P>Prices for our products are subject to change without notice.</P>

        <P>
          We reserve the right at any time to modify or discontinue the Service
          (or any part or content thereof) without notice at any time.
        </P>

        <P>
          We shall not be liable to you or to any third-party for any
          modification, price change, suspension or discontinuance of the
          Service.
        </P>

        <Header>SECTION 5 - PRODUCTS OR SERVICES (if applicable)</Header>

        <P>
          Certain products or services may be available exclusively online
          through the website. These products or services may have limited
          quantities and are subject to return or exchange only according to our
          Return Policy.
        </P>

        <P>
          We have made every effort to display as accurately as possible the
          colors and images of our products that appear at the store. We cannot
          guarantee that your computer monitor&apos;s display of any color will be
          accurate.
        </P>

        <P>
          We reserve the right, but are not obligated, to limit the sales of our
          products or Services to any person, geographic region or jurisdiction.
          We may exercise this right on a case-by-case basis. We reserve the
          right to limit the quantities of any products or services that we
          offer. All descriptions of products or product pricing are subject to
          change at anytime without notice, at the sole discretion of us. We
          reserve the right to discontinue any product at any time. Any offer
          for any product or service made on this site is void where prohibited.
        </P>

        <P>
          We do not warrant that the quality of any products, services,
          information, or other material purchased or obtained by you will meet
          your expectations, or that any errors in the Service will be
          corrected.
        </P>

        <Header>SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION</Header>

        <P>
          We reserve the right to refuse any order you place with us. We may, in
          our sole discretion, limit or cancel quantities purchased per person,
          per household or per order. These restrictions may include orders
          placed by or under the same customer account, the same credit card,
          and/or orders that use the same billing and/or shipping address. In
          the event that we make a change to or cancel an order, we may attempt
          to notify you by contacting the e-mail and/or billing address/phone
          number provided at the time the order was made. We reserve the right
          to limit or prohibit orders that, in our sole judgment, appear to be
          placed by dealers, resellers or distributors.
        </P>

        <P>
          You agree to provide current, complete and accurate purchase and
          account information for all purchases made at our store. You agree to
          promptly update your account and other information, including your
          email address and credit card numbers and expiration dates, so that we
          can complete your transactions and contact you as needed.
        </P>

        <P>For more detail, please review our Returns Policy.</P>

        <Header>SECTION 7 - OPTIONAL TOOLS</Header>

        <P>
          We may provide you with access to third-party tools over which we
          neither monitor nor have any control nor input.
        </P>

        <P>
          You acknowledge and agree that we provide access to such tools ”as is”
          and “as available” without any warranties, representations or
          conditions of any kind and without any endorsement. We shall have no
          liability whatsoever arising from or relating to your use of optional
          third-party tools.
        </P>

        <P>
          Any use by you of optional tools offered through the site is entirely
          at your own risk and discretion and you should ensure that you are
          familiar with and approve of the terms on which tools are provided by
          the relevant third-party provider(s).
        </P>

        <P>
          We may also, in the future, offer new services and/or features through
          the website (including, the release of new tools and resources). Such
          new features and/or services shall also be subject to these Terms of
          Service.
        </P>

        <Header>SECTION 8 - THIRD-PARTY LINKS</Header>

        <P>
          Certain content, products and services available via our Service may
          include materials from third-parties.
        </P>

        <P>
          Third-party links on this site may direct you to third-party websites
          that are not affiliated with us. We are not responsible for examining
          or evaluating the content or accuracy and we do not warrant and will
          not have any liability or responsibility for any third-party materials
          or websites, or for any other materials, products, or services of
          third-parties.
        </P>

        <P>
          We are not liable for any harm or damages related to the purchase or
          use of goods, services, resources, content, or any other transactions
          made in connection with any third-party websites. Please review
          carefully the third-party&apos;s policies and practices and make sure you
          understand them before you engage in any transaction. Complaints,
          claims, concerns, or questions regarding third-party products should
          be directed to the third-party.
        </P>

        <Header>
          SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS
        </Header>

        <P>
          If, at our request, you send certain specific submissions (for example
          contest entries) or without a request from us you send creative ideas,
          suggestions, proposals, plans, or other materials, whether online, by
          email, by postal mail, or otherwise (collectively, &apos;comments&apos;), you
          agree that we may, at any time, without restriction, edit, copy,
          publish, distribute, translate and otherwise use in any medium any
          comments that you forward to us. We are and shall be under no
          obligation (1) to maintain any comments in confidence; (2) to pay
          compensation for any comments; or (3) to respond to any comments.
        </P>

        <P>
          We may, but have no obligation to, monitor, edit or remove content
          that we determine in our sole discretion are unlawful, offensive,
          threatening, libelous, defamatory, pornographic, obscene or otherwise
          objectionable or violates any party’s intellectual property or these
          Terms of Service.
        </P>

        <P>
          You agree that your comments will not violate any right of any
          third-party, including copyright, trademark, privacy, personality or
          other personal or proprietary right. You further agree that your
          comments will not contain libelous or otherwise unlawful, abusive or
          obscene material, or contain any computer virus or other malware that
          could in any way affect the operation of the Service or any related
          website. You may not use a false e-mail address, pretend to be someone
          other than yourself, or otherwise mislead us or third-parties as to
          the origin of any comments. You are solely responsible for any
          comments you make and their accuracy. We take no responsibility and
          assume no liability for any comments posted by you or any third-party.
        </P>

        <Header>SECTION 10 - PERSONAL INFORMATION</Header>

        <P>
          Your submission of personal information through the store is governed
          by our Privacy Policy. To view our Privacy Policy.
        </P>

        <Header>SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS</Header>

        <P>
          Occasionally there may be information on our site or in the Service
          that contains typographical errors, inaccuracies or omissions that may
          relate to product descriptions, pricing, promotions, offers, product
          shipping charges, transit times and availability. We reserve the right
          to correct any errors, inaccuracies or omissions, and to change or
          update information or cancel orders if any information in the Service
          or on any related website is inaccurate at any time without prior
          notice (including after you have submitted your order).
        </P>

        <P>
          We undertake no obligation to update, amend or clarify information in
          the Service or on any related website, including without limitation,
          pricing information, except as required by law. No specified update or
          refresh date applied in the Service or on any related website, should
          be taken to indicate that all information in the Service or on any
          related website has been modified or updated.
        </P>

        <Header>SECTION 12 - PROHIBITED USES</Header>

        <P>
          In addition to other prohibitions as set forth in the Terms of
          Service, you are prohibited from using the site or its content: (a)
          for any unlawful purpose; (b) to solicit others to perform or
          participate in any unlawful acts; (c) to violate any international,
          federal, provincial or state regulations, rules, laws, or local
          ordinances; (d) to infringe upon or violate our intellectual property
          rights or the intellectual property rights of others; (e) to harass,
          abuse, insult, harm, defame, slander, disparage, intimidate, or
          discriminate based on gender, sexual orientation, religion, ethnicity,
          race, age, national origin, or disability; (f) to submit false or
          misleading information; (g) to upload or transmit viruses or any other
          type of malicious code that will or may be used in any way that will
          affect the functionality or operation of the Service or of any related
          website, other websites, or the Internet; (h) to collect or track the
          personal information of others; (i) to spam, phish, pharm, pretext,
          spider, crawl, or scrape; (j) for any obscene or immoral purpose; or
          (k) to interfere with or circumvent the security features of the
          Service or any related website, other websites, or the Internet. We
          reserve the right to terminate your use of the Service or any related
          website for violating any of the prohibited uses.
        </P>

        <Header>
          SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
        </Header>

        <P>
          We do not guarantee, represent or warrant that your use of our service
          will be uninterrupted, timely, secure or error-free.
        </P>

        <P>
          We do not warrant that the results that may be obtained from the use
          of the service will be accurate or reliable.
        </P>

        <P>
          You agree that from time to time we may remove the service for
          indefinite periods of time or cancel the service at any time, without
          notice to you.
        </P>

        <P>
          You expressly agree that your use of, or inability to use, the service
          is at your sole risk. The service and all products and services
          delivered to you through the service are (except as expressly stated
          by us) provided &apos;as is&apos; and &apos;as available&apos; for your use, without any
          representation, warranties or conditions of any kind, either express
          or implied, including all implied warranties or conditions of
          merchantability, merchantable quality, fitness for a particular
          purpose, durability, title, and non-infringement.
        </P>

        <P>
          In no case shall ALTS CORP, our directors, officers, employees,
          affiliates, agents, contractors, interns, suppliers, service providers
          or licensors be liable for any injury, loss, claim, or any direct,
          indirect, incidental, punitive, special, or consequential damages of
          any kind, including, without limitation lost profits, lost revenue,
          lost savings, loss of data, replacement costs, or any similar damages,
          whether based in contract, tort (including negligence), strict
          liability or otherwise, arising from your use of any of the service or
          any products procured using the service, or for any other claim
          related in any way to your use of the service or any product,
          including, but not limited to, any errors or omissions in any content,
          or any loss or damage of any kind incurred as a result of the use of
          the service or any content (or product) posted, transmitted, or
          otherwise made available via the service, even if advised of their
          possibility. Because some states or jurisdictions do not allow the
          exclusion or the limitation of liability for consequential or
          incidental damages, in such states or jurisdictions, our liability
          shall be limited to the maximum extent permitted by law.
        </P>

        <Header>SECTION 14 - INDEMNIFICATION</Header>

        <P>
          You agree to indemnify, defend and hold harmless ALTS CORP and our
          parent, subsidiaries, affiliates, partners, officers, directors,
          agents, contractors, licensors, service providers, subcontractors,
          suppliers, interns and employees, harmless from any claim or demand,
          including reasonable attorneys’ fees, made by any third-party due to
          or arising out of your breach of these Terms of Service or the
          documents they incorporate by reference, or your violation of any law
          or the rights of a third-party.
        </P>

        <Header>SECTION 15 - SEVERABILITY</Header>

        <P>
          In the event that any provision of these Terms of Service is
          determined to be unlawful, void or unenforceable, such provision shall
          nonetheless be enforceable to the fullest extent permitted by
          applicable law, and the unenforceable portion shall be deemed to be
          severed from these Terms of Service, such determination shall not
          affect the validity and enforceability of any other remaining
          provisions.
        </P>

        <Header>SECTION 16 - TERMINATION</Header>

        <P>
          The obligations and liabilities of the parties incurred prior to the
          termination date shall survive the termination of this agreement for
          all purposes.
        </P>

        <P>
          These Terms of Service are effective unless and until terminated by
          either you or us. You may terminate these Terms of Service at any time
          by notifying us that you no longer wish to use our Services, or when
          you cease using our site.
        </P>

        <P>
          If in our sole judgment you fail, or we suspect that you have failed,
          to comply with any term or provision of these Terms of Service, we
          also may terminate this agreement at any time without notice and you
          will remain liable for all amounts due up to and including the date of
          termination; and/or accordingly may deny you access to our Services
          (or any part thereof).
        </P>

        <Header>SECTION 17 - ENTIRE AGREEMENT</Header>

        <P>
          The failure of us to exercise or enforce any right or provision of
          these Terms of Service shall not constitute a waiver of such right or
          provision.
        </P>

        <P>
          These Terms of Service and any policies or operating rules posted by
          us on this site or in respect to The Service constitutes the entire
          agreement and understanding between you and us and govern your use of
          the Service, superseding any prior or contemporaneous agreements,
          communications and proposals, whether oral or written, between you and
          us (including, but not limited to, any prior versions of the Terms of
          Service).
        </P>

        <P>
          Any ambiguities in the interpretation of these Terms of Service shall
          not be construed against the drafting party.
        </P>

        <Header>SECTION 18 - GOVERNING LAW</Header>

        <P>
          These Terms of Service and any separate agreements whereby we provide
          you Services shall be governed by and construed in accordance with the
          laws of VIC, Australia.
        </P>

        <Header>SECTION 19 - CHANGES TO TERMS OF SERVICE</Header>

        <P>
          You can review the most current version of the Terms of Service at any
          time at this page.
        </P>

        <P>
          We reserve the right, at our sole discretion, to update, change or
          replace any part of these Terms of Service by posting updates and
          changes to our website. It is your responsibility to check our website
          periodically for changes. Your continued use of or access to our
          website or the Service following the posting of any changes to these
          Terms of Service constitutes acceptance of those changes.
        </P>

        <Header>SECTION 20 - CONTACT INFORMATION</Header>

        <P>
          Questions about the Terms of Service should be sent to us at
          legal@altscorp.com.au.
        </P>

        <Header>
          2 ACCESS TO SERVICE
          <P>Powered by GlobalX</P>
        </Header>

        <Header>2.1 Non-exclusive Licence to Access</Header>

        <P>
          ALTS CORP and GlobalX grant to the Customer a non-exclusive right to
          access the Service subject to:
        </P>

        <P>(a) the terms and conditions of the Agreement;</P>

        <P>
          (b) the Customer’s continuing adherence to the operating instructions
          displayed on the electronic platform for the Service from time to
          time; and
        </P>

        <P>
          (c) any reasonable requirement notified to the Customer by the Service
          Provider from time to time.
        </P>

        <Header>2.2 Order (offer) and Acceptance</Header>

        <P>
          (a) A Customer may order Services by placing an online order on or
          through the GlobalX Website (Order Form) and in relation to ordering
          the Customer agrees that:
        </P>

        <P>
          (i) by placing an online order on the GlobalX Website, the Customer is
          offering to purchase the Service from the Service Provider in
          accordance with this Agreement;
        </P>

        <P>
          (ii) the Service Provider may accept the Customer’s offer by
          delivering the Content to the Customer or undertaking the Service. The
          Service Provider will not be obliged to accept the Customer’s offer
          even if the Customer has pre-paid for the Service. The Service
          Provider may reject the Customer’s offer by refunding to the Customer
          any payment made by the Customer; and
        </P>

        <P>
          (iii) Content ordered by the Customer will be delivered to the
          Customer at the email address nominated by the Customer on an Order
          Form or delivered via Intelli-Doc or in such other manner as may be
          agreed to between the Customer and the Service Provider (including
          through a Software Product).
        </P>

        <P>
          (b) In addition to the methods described in clause 2.2(a), a Customer
          may order Manual Services or other services by submitting a request to
          GlobalX using an electronic or hard copy Order Form supplied by
          GlobalX. GlobalX will notify the Customer within a reasonable period
          of time if the request for Manual Services or other services is not
          accepted. If the request is accepted, GlobalX will communicate
          acceptance by acting in accordance with the Customer’s instructions.
        </P>

        <Header>3 ADDITIONAL PROVISIONS FOR CONTENT SERVICES</Header>

        <Header>3.1 Agency</Header>

        <P>
          The Customer hereby appoints ALTS CORP as its agent for the sole
          purpose of ordering and obtaining any Property Certificate that:
        </P>

        <P>(a) the Customer orders pursuant to this agreement; and</P>

        <P>(b) is exempt from GST.</P>

        <Header>3.2 Victoria Landata</Header>

        <P>
          If the Customer wishes to access Information Provider Information from
          Victoria Landata® the Customer must first duly execute the documents
          required from time to time by Victoria Landata® and GlobalX and
          deliver the original signed documents to GlobalX. (All pages must be
          received (in originally signed form), not just the signature page.) If
          at any time Victoria Landata® or GlobalX require that any additional
          or amended documents be signed by the Customer so as to allow the
          Customer to access Information Provider Information from Victoria
          Landata® the Customer must duly execute the amended or additional
          documents and deliver the original signed amended or additional
          documents to GlobalX before further access is permitted. The Customer
          agrees to strictly observe the terms of any documents it signs
          pursuant to this clause.
        </P>

        <Header>7 ADDITION PROVISIONS IN RELATION TO THE SERVICE</Header>

        <Header>7.3 Customer liable for Charges</Header>

        <P>
          The Customer is liable for all Charges resulting from the use of the
          Software Product or Service through the Customer’s Security
          Information whether such use of the Software Product or Service was
          authorised by the Customer or not. The Customer must immediately
          inform the Service Provider of loss of Security Information or any
          unauthorised access to or misuse of the Service.
        </P>

        <Header>7.4 Deactivation of Security Information</Header>

        <P>
          GlobalX will deactivate the Customer’s Security Information within two
          (2) Business Hours of an emailed request to helpdesk@globalx.com.au.
        </P>

        <Header>7.5 Password Changes</Header>

        <P>
          The Service Provider reserves the right to enforce user name and
          password changes as required for security, confidentiality and other
          legal compliance.
        </P>

        <Header>7.7 No Legal Advice</Header>

        <P>
          The Customer acknowledges that no Service Provider purports to give
          legal advice through the provision of the Services or Software
          Products.
        </P>

        <Header>7.8 Assistance with the Service</Header>

        <P>
          GlobalX will provide the Customer with assistance (within Business
          Hours) through its Help Desk in order to assist the Customer with any
          enquiries about the Service.
        </P>

        <Header>7.9 No Warranty re Information Provider Information</Header>

        <P>
          The Customer acknowledges that ALTS CORP and GlobalX give no warranty
          or representation that any Information Provider Information or Content
          provided through any Information Provider is complete, accurate or
          up-to- date.
        </P>

        <Header>7.10 Limitations to Access to Service</Header>

        <P>
          (a) GlobalX will use its best endeavours to provide access to the
          GlobalX electronic platform for the Service during Business Hours but
          will not be liable for any loss or damage sustained by the Customer
          caused by the failure of GlobalX to provide access to the electronic
          platform for the Service during Business Hours.
        </P>

        <P>
          (b) In respect of its use of the Service, the Customer acknowledges
          that:
        </P>

        <P>
          (i) the Customer’s access to the Service may be limited to the hours
          of access provided by Information Providers. These hours will be
          notified on the electronic platform for the Service; and
        </P>

        <P>
          (ii) access to the Service or particular Content provided through the
          Service may from time to time be unavailable due to circumstances
          beyond the control of GlobalX, in which case GlobalX or any Service
          Provider shall not be liable for any loss or damage sustained by the
          Customer caused by the unavailability of the Content or the Service.
        </P>

        <Header>7.11 Content not to be Reproduced</Header>

        <P>
          The Customer agrees not to reproduce, retransmit, redistribute,
          disseminate, sell, publish or circulate any Content obtained through
          the Service to any other person other than:
        </P>

        <P>
          (a) Content used in the course of the Customer’s usual business
          (including but not limited to a Customer law firm providing the
          results of searches to their client, the other party or financiers to
          a transaction); or
        </P>

        <P>
          (b) if the Customer is an authorised reseller, to its end user
          customers.
        </P>

        <Header>7.12 Document Repository Service</Header>

        <P>
          The Service Provider may offer a document repository service on the
          electronic platform for the Service. The Customer acknowledges that on
          expiration or termination of this Agreement for any reason, access to
          the historical documents stored on the document repository will be
          immediately irrevocably relinquished.
        </P>

        <Header>7.13 Information provided by Customer</Header>

        <P>
          The Customer must provide the Service Provider with all information
          and assistance and accessories reasonably required by the Service
          Provider to enable it to supply the Service to the Customer. The
          Customer warrants that it is responsible for the accuracy,
          completeness and currency of the information submitted to ALTS CORP,
          GlobalX and any Information Provider through the use of the Service or
          Software Product. If inaccurate, incomplete or non-current information
          is supplied by the Customer, then ALTS CORP and GlobalX (or any member
          of the GlobalX Group) will not be liable for any loss or damage
          (including consequential loss or damage, which includes, without
          limitation, loss of profits, business, revenue or data) arising from
          the use of the Service or Software Product.
        </P>

        <Header>8 VARIATION OF TERMS</Header>

        <Header>8.1 Variation of Terms</Header>

        <P>
          GlobalX may change the provisions of this Agreement at its absolute
          discretion from time to time:
        </P>

        <P>
          (a) in respect of provisions of this Agreement that relate to the
          provision of Services, on not less than 30 days written notice by
          GlobalX to the Customer (or such shorter period requested by an
          Information Provider); and
        </P>

        <P>
          (b)in respect of provisions of this Agreement that relate to the
          Software Licence, by written notice by GlobalX to the Customer at
          least 30 days prior to the renewal date of the Software Licence (and
          if there is more than one Software Licence and they have different
          renewal dates, at least 30 days prior to at least one half of those
          licences), and the Customer acknowledges that there is only one End
          User Agreement but there is likely to be multiple Order Forms.
        </P>

        <Header>9 CHARGES</Header>

        <Header>9.1 Charges</Header>

        <P>
          The Customer must pay the Charges within 14 days from the invoice date
          for Services (in exchange for the relevant tax invoice) for any
          Service or Software Product provided to the Customer by GlobalX or a
          Service Provider under this Agreement.
        </P>

        <Header>9.2 Change in Price List</Header>

        <P>
          A Service Provider may vary or change the Price List from time to
          time. The applicable Price List for a Service will be the Price List
          that is current at the time that the Service is provided by the
          Service Provider.
        </P>

        <P>
          A Service Provider may from time to time change the price for a
          Service or Software Product not contemplated on the Price List or an
          Order Form at its absolute discretion without being required to
          provide notice to the Customer.
        </P>

        <P>
          On occasions Information Providers do not provide ALTS CORP and
          GlobalX with prompt notification of the change in the fees they
          charge. If the Customer orders a Service and the Service Provider is
          of the opinion that the price for that Service does not take into
          account a recent price increase by an Information Provider, the
          Service Provider must promptly advise the Customer of the situation.
          The Service Provider has no obligation to perform the relevant part of
          the Service until the Customer agrees to pay an increase in the Charge
          equal to the Information Provider’s price increase.
        </P>

        <Header>9.3 Manner of Payment</Header>

        <P>
          The Customer will make payment in the manner specified in this
          Agreement or as set out in a Price List. Subject to the previous
          sentence, payments must only be made by direct debit, cheque or
          electronic fund transfer.
        </P>

        <Header>9.3 Customer liable for the Charges</Header>

        <P>
          The Customer agrees the Customer is personally liable for the Charges
          (even if the Customer has incurred such fees or charges on behalf of a
          third party).
        </P>

        <P>
          The Customer will be charged for every search conducted on the GlobalX
          Website. No refunds will be given if the Customer is unhappy with the
          purchase or the result of a Customer error. The Service Provider may
          provide the Customer with search credits provided that, within seven
          (7) days of the search being conducted, the Customer notifies the
          Search Provider of the time, date, search type and reason for credit
          request. The Search Provider has an absolute discretion on whether or
          not to provide credits.
        </P>

        <Header>10 INTELLECTUAL PROPERTY AND CONFIDENTIAL INFORMATION</Header>

        <Header>10.1 GlobalX’s warranty regarding Intellectual Property</Header>

        <P>
          GlobalX warrants that the GlobalX Group has all right, title and
          interest in the intellectual property rights reasonably necessary to
          enable the Customer to use the Software Products and Services
          (excluding third party software), provided in accordance with this
          Agreement from time to time.
        </P>

        <Header>10.2 GlobalX’s ownership of Intellectual Property</Header>

        <P>
          GlobalX owns all intellectual property in any customisation,
          alteration or Update of any Software Product (even if made at the
          specific request of the Customer and in exchange for a fee).
        </P>

        <Header>10.3 Property Rights in Content</Header>

        <P>The Customer agrees:</P>

        <P>
          (a) that Content provided through the Service may be subject to
          copyright, intellectual property rights and other property rights of
          the Service Provider or another entity (including but not limited to
          an Information Provider);
        </P>

        <P>
          (b) not to do or omit to do anything which infringes these rights; and
        </P>

        <P>
          (c) any copyright notations on Content must remain on the Content in
          whatever form it is re-produced by the Customer.
        </P>

        <Header>
          10.4 Customer’s obligations in relation to Confidential Information
        </Header>

        <P>The Customer:</P>
        <P>(a) agrees to keep confidential the</P>

        <P>Confidential Information;</P>

        <P>
          (b) must not make public, disclose or use the Intellectual Property
          for any purpose other than that for which it was obtained;
        </P>

        <P>
          (c) must not use the Confidential Information outside of the
          Customer’s business environment; and
        </P>

        <P>
          (d) must comply with any specific directions from GlobalX or any
          relevant Information Provider with respect to Confidential
          Information.
        </P>

        <Header>11 THIRD PARTY CONDITIONS AND INFORMATION</Header>

        <Header>
          11.1 Customer’s Acknowledgement regarding Third Party Agreements
        </Header>

        <P>The Customer acknowledges that:</P>

        <P>
          (a) GlobalX is a party to various agreements with third parties,
          including Information Providers (“Third Party Agreements”) which
          enable the delivery of Information Provider Information and other
          services via the Service or Software Product;
        </P>

        <P>
          (b) the Third Party often require the Service Provider to impose
          certain terms and conditions on the users of the Content including in
          relation to the use and security of access to the Content;
        </P>

        <P>
          (c) third parties, and in particular, government departments and
          agencies, treat any potential breach or misuse of Content, whether by
          the Service Provider, the Customer or others, very seriously;
        </P>

        <P>
          (d) any unauthorised conduct by the Customer has the potential to
          cause significant detriment to GlobalX in relation to its contractual
          relationships with those third parties; and
        </P>

        <P>
          (e) a breach of this Agreement by the Customer may cause a breach by
          GlobalX or a member of the GlobalX Group of one or more Third Party
          Agreements.
        </P>

        <Header>
          11.2 Customer to comply with Information Provider’s Conditions
        </Header>

        <P>The Customer agrees to:</P>

        <P>
          (a) read any and all deeds, terms and conditions of use of the various
          Information Providers (contained on the respective websites of those
          Information Providers), from time to time, and undertakes to adhere to
          these at all times; and
        </P>

        <P>
          (b) comply with any and all conditions of Information Providers (from
          time to time) relating to the use of Content that is obtained through
          the Service (including but not limited to the prohibition on use of
          the Content for Direct Marketing).
        </P>

        <Header>
          11.3 Customer not Representative of Information Provider
        </Header>

        <P>
          The Customer warrants that it will not hold itself out as being part
          of, or a representative of, any Information Provider, ALTS CORP or
          GlobalX.
        </P>

        <Header>11.4 Customer to Indemnify</Header>

        <P>
          The Customer indemnifies, and will keep indemnified, ALTS CORP,
          GlobalX and the GlobalX Group in respect of any cost, expense, damage,
          loss or liability (including legal costs on a full indemnity basis) to
          any of them resulting from a breach by the Customer of the customer’s
          obligations under this Part 11.
        </P>

        <Header>11.5 ASIC Content</Header>

        <P>
          In respect of any ASIC Content provided by ALTS CORP and/or GlobalX to
          the Customer, the Customer agrees that:
        </P>

        <P>
          (a) the Search Extracts contained in the ASIC System and ASIC
          Registers are based on information provided to ASIC by third parties;
        </P>

        <P>
          (b) ASIC has not verified the accuracy, currency, reliability or
          completeness of the Search Extracts and makes no representation or
          warranty as to their accuracy, currency or reliability;
        </P>

        <P>
          (c) ASIC will have no liability to any persons for any inaccuracy,
          omission, defect or error in the Test Database, ASIC System or ASIC
          Registers; and
        </P>

        <P>
          (d) extracts in relation to companies limited by guarantee which are
          registered charities with the Australian Charities and Not-for-profits
          Commission may not be up to date as such entities now notify changes
          to the Australian Charities and Not-for-profits Commission, not ASIC.
        </P>

        <Header>11.6 GlobalX’s obligations regarding Information</Header>

        <P>
          Subject to this Agreement, GlobalX acknowledges that information
          passed to an Information Provider may be confidential and that all
          reasonable precautions are taken by GlobalX to ensure confidentiality.
        </P>

        <Header>11.7 Format of Information</Header>

        <P>
          The Customer acknowledges that information may be transmitted to it
          through a medium and in any format or form as required or specified by
          an Information Provider, and, as such, ALTS CORP and GlobalX may not
          have the choice as to the medium, format or form in which the
          information is transmitted.
        </P>

        <Header>
          12 GENERAL WARRANTIES, LIABILITY AND EXCLUSIONS FROM LIABILITY
        </Header>

        <Header>12.1 No Warranty or Representation by Service Providers</Header>

        <P>
          ALTS CORP and GlobalX (or any member of the GlobalX Group) do not make
          any express or implied warranties that the Services or Software
          Product will:
        </P>

        <P>(a) operate error free;</P>

        <P>(b) be uninterrupted while in use; or</P>

        <P>(c) be available at any or all times.</P>

        <P>
          The Customer acknowledges that ALTS CORP and GlobalX do not make any
          representations or warranties with respect to the usefulness or
          efficiency of any Software Product or any Service provided under this
          Agreement. The Customer has made its own enquiries and is satisfied
          with the usefulness and efficiency of the Software Product and
          Services.
        </P>

        <Header>14 TERMINATION OF THIS AGREEMENT (IN WHOLE OR PART)</Header>

        <Header>14.1 Termination of this Agreement by the Customer</Header>

        <P>
          (a) The Customer may terminate this Agreement by giving both ALTS CORP
          and GlobalX at least thirty (30) days advance written notice of such
          termination in which event:
        </P>

        <P>
          (i) all Charges owing by the Customer to the Service Provider are then
          immediately due and payable as at the date of termination; and
        </P>

        <P>
          (ii) all Charges then paid by the Customer to the Service Provider
          (whether in the nature of prepayment or otherwise) shall be forfeited
          to and shall be the absolute property of the Service Provider.
        </P>

        <P>
          (b) The Customer is deemed to have repudiated this Agreement if any
          Charges owing by the Customer under this Agreement remain unpaid for
          30 days after the due date for payment, unless the Service Provider to
          whom the Charges are owing gives express written notice before that
          date suspending the operation of this clause on such terms as such
          Service Provider may specify.
        </P>

        <Header>14.2 Termination of this Agreement by Service Provider</Header>

        <P>(a) Under this clause 14, a Service Provider may at its election:</P>

        <P>(i) terminate this Agreement in its entirety; or</P>

        <P>
          (ii) terminate any part or parts of the Service or Software Product
          being supplied pursuant to this Agreement (including but not limited
          to the termination of provision of a specific Service or Software
          Product to the Customer), in which event the remainder of the
          Agreement will remain in force and will continue to be binding upon
          the Customer.
        </P>

        <P>
          (b) A Service Provider may, by notice in writing to the Customer,
          immediately suspend the Customer’s access to the Service or the
          Software Product, or any part of the Service or the Software Product
          if the Customer commits or is reasonably suspected by the Service
          Provider of committing an Act of Default;
        </P>

        <P>
          (c) During the period of suspension, the Service Provider must elect
          (within a reasonable time) to either:
        </P>

        <P>
          (i) terminate this Agreement or any part of this Agreement with the
          Customer for the Customer’s Act of Default; or
        </P>

        <P>
          (ii) restore access to the Service or Software Product on such terms
          that the Service Provider in its absolute discretion sees fit
          (including, but not limited to, the issue to the Customer of new
          Security Information) assuming the Act of Default has been remedied
          and the Service Provider is reasonably satisfied that the Act of
          Default will not occur again.
        </P>

        <P>
          (d) If a Customer’s access to the Service or to a Software Product is
          suspended pursuant to paragraph (b), the Customer must pay to GlobalX
          reinstatement fee in an amount determined by GlobalX in its absolute
          discretion prior to access to the Software Product being reinstated
          unless GlobalX agrees otherwise.
        </P>

        <Header>14.3 Effect of Termination</Header>

        <P>Termination of this Agreement will not:</P>

        <P>
          (a) release the Customer from liability in respect of any breach or
          non-performance of any obligation contained in this Agreement; and
        </P>

        <P>
          (b) affect any rights or remedies which the Service Provider may have
          otherwise under this Agreement or at law, and the Customer
          acknowledges that any indemnities given by it under any provision in
          this Agreement shall survive the termination of this Agreement.
        </P>

        <Header>15 GUARANTEE AND INDEMNITY</Header>

        <Header>15.1 Application of Part 15</Header>

        <P>
          This Part 15 only applies if an entity is named in the Information
          Schedule as “Guarantor” and such entity signs this Agreement.
        </P>

        <Header>15.2 Guarantee</Header>

        <P>
          The Guarantor guarantees to ALTS CORP and GlobalX that the Customer
          will strictly perform and fulfil all of the Customer’s obligations
          under this Agreement.
        </P>

        <Header>15.3 Indemnity</Header>

        <P>
          The Guarantor agrees to indemnify and keep indemnified both ALTS CORP
          and GlobalX in respect of all expenses, losses, damages and costs
          incurred by or awarded against either of them arising from or in
          connection with the Customer breaching the Customer’s obligations
          under this Agreement. This indemnity will continue notwithstanding
          termination of this Agreement.
        </P>

        <Header>QLD Department of Natural Resources, Mines & Energy</Header>

        <Header>Standard Terms</Header>

        <Header>Definitions</Header>

        <P>
          Direct Marketing means one to one marketing using personal details
          (e.g. name, address, email address or other Personal Information),
          normally supported by a database/resource, which uses one or more
          advertising media to effect a measurable response and/or transaction
          from a person (including a corporation or organisation) and includes,
          but is not limited to, telemarketing, bulk email messaging (spam),
          postal canvassing and list brokering.
        </P>

        <Header>
          Information Product means a product supplied through online access
          search types (e.g. Title Search).
        </Header>

        <P>
          Personal Information means information or an opinion (including
          information or an opinion forming part of a database), whether true or
          not and whether recorded in a material form or not, about an
          individual whose identity is apparent or can reasonably be ascertained
          from the information or opinion.
        </P>

        <Header>Ownership</Header>

        <P>
          I acknowledge that I have no rights of ownership in the Information
          Products and all intellectual property rights, including copyright in
          the Information Products that the State of Queensland (Department of
          Natural Resources, Mines and Energy) or the copyright owner has, are
          retained by the State of Queensland (Department of Natural Resources,
          Mines and Energy) or the copyright owner.
        </P>

        <Header>Liability</Header>

        <P>
          I acknowledge that, except as provided in the section titled Statutory
          Compensation below, the State of Queensland (Department of Natural
          Resources, Mines and Energy) does not guarantee the accuracy or
          completeness of the Information Products, and does not make any
          warranty about the Information Products.
        </P>

        <P>
          I agree that, except as provided in the section titled Statutory
          Compensation below, the State of Queensland (Department of Natural
          Resources, Mines and Energy) is not under any liability to me for any
          loss or damage (including consequential loss or damage) arising out of
          or in connection with my use of the Information Products.
        </P>

        <Header>Statutory Compensation</Header>

        <P>
          The provisions of the section titled Liability above are subject to
          the provision that the State of Queensland through the Department of
          Natural Resources, Mines and Energy will be liable to compensate me in
          accordance with the provisions of Subdivision C of Division 2 of Part
          9 of the Land Title Act 1994 (as amended) if I suffer deprivation of a
          lot, interest in a lot or loss or damage in accordance with the Land
          Title Act. Where I am entitled to compensation against the State of
          Queensland through the Department of Natural Resources, Mines and
          Energy pursuant to the above-mentioned provisions of the Land Title
          Act, I agree that I will seek compensation in accordance with the
          provisions of the Land Title Act.
        </P>

        <Header>Privacy</Header>

        <P>
          I agree that I will not use, other than for the purpose for which the
          Information Products are provided under this agreement, or disclose to
          any other person, any Personal Information contained in the
          Information Products.
        </P>

        <P>
          I agree that I will not use the Information Products for Direct
          Marketing.
        </P>

        <Header>Permitted Use</Header>

        <P>
          I accept that the use of the Information Products by me will be
          limited to my own personal use or for use in the ordinary course of my
          business. I will not on-sell or distribute the Information Products to
          any other third party, nor will I produce any products incorporating
          the Information Products, except with the prior written approval of
          the State of Queensland (Department of Natural Resources, Mines and
          Energy).
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

export default TermsOfService;
