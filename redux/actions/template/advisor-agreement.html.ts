/* eslint-disable no-tabs */
const AdvisorAgreemt = `
<div class="contract" style="width: 100%; padding:10px; background-color:white; color: black;">
<span id="customTitle" style="display: none">{{customTitle}}</span>
<div style="display: flex; justify-content: center;"><h2 style="text-align: center; background-color:#f79632; display: inline;">{{#companyName}}{{{companyName}}}{{/companyName}}{{^companyName}}[COMPANY NAME]{{/companyName}}</h2></div>
<h1 id="title" style="text-align: center;">ADVISOR AGREEMENT</h1><h1 class="western" style="text-align: center;"><span style="font-size: medium;"><span lang="en-US"><strong>&nbsp;<div style="display: inline-block; background-color:#f79632"><span id="partyName" style="display: none">{{partyName}}</span></div></strong></span></span></h1>
<p align="center" style="color: black;"><u><strong>Advisor Agreement</strong></u></p>
<p style="color: black;">This Advisor Agreement (this "<u>Agreement</u>") is entered into as of <div style="display: inline-block; background-color:#f79632"><span id="createDate">{{#date}}{{{date}}}{{/date}}{{^date}}[DATE]{{/date}}</span></div>, by and between <div style="display: inline-block; background-color:#f79632">{{#companyName}}{{{companyName}}}{{/companyName}}{{^companyName}}[COMPANY NAME]{{/companyName}}</div>, a <div style="display: inline-block; background-color:#f79632">{{#stateOfAdvisor}}{{{stateOfAdvisor}}}{{/stateOfAdvisor}}{{^stateOfAdvisor}}[STATE]{{/stateOfAdvisor}}
</div> <div style="display: inline-block; background-color:#f79632">{{#typeCompany}}{{{typeCompany}}}{{/typeCompany}}{{^typeCompany}}[TYPE OF COMPANY]{{/typeCompany}}
</div> (the "Company"), and  <div style="display: inline-block; background-color:#f79632"><span id="counterPartyName">{{#counterPartyName}}{{{counterPartyName}}}{{/counterPartyName}}{{^counterPartyName}}[ADVISOR NAME]{{/counterPartyName}}</span></div> ("<u>Advisor</u>").</p>
<p style="color: black;" align="justify">The parties agree as follows:</p>
<ol>
    <li>
        <p style="color: black;"><u><strong>Services</strong></u>. Advisor agrees to act as an advisor to the Company and to provide advice and assistance to the Company as is mutually agreed by the parties (collectively, the "<u>Services</u>").</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Compensation</strong></u>. Advisor shall not be entitled to receive any cash compensation for the Services provided hereunder. However, subject to the approval of the Company's Board of Directors, Advisor will be granted <div style="display: inline-block; background-color:#f79632">{{#advisorOption}}{{{advisorOption}}}{{/advisorOption}}{{^advisorOption}}[a nonstatutory option] OR [a right]{{/advisorOption}}</div> to purchase <div style="display: inline-block; background-color:#f79632">{{numberOfShares}}</div> shares of the Company's common stock. The <div style="display: inline-block; background-color:#f79632">{{#option}}{{{option}}}{{/option}}{{^option}}{{#purchaseRight}}{{{purchaseRight}}}{{/purchaseRight}}{{^purchaseRight}}[option] OR [purchase right]{{/purchaseRight}}{{/option}}</div> will be subject to the terms and conditions applicable to <div style="display: inline-block; background-color:#f79632">{{#options}}{{{options}}}{{/options}}{{^options}}{{#restrictedStockPurchaseAwards}}{{{restrictedStockPurchaseAwards}}}{{/restrictedStockPurchaseAwards}}{{^restrictedStockPurchaseAwards}}[options] OR [restricted stock purchase awards]{{/restrictedStockPurchaseAwards}}{{/options}}</div> granted under the Company's <div style="display: inline-block; background-color:#f79632">{{#stockPlanName}}{{{stockPlanName}}}{{/stockPlanName}}{{^stockPlanName}}[STOCK PLAN NAME]{{/stockPlanName}}</div> (the "<u>Plan</u>"), as described in that plan and the applicable <div style="display: inline-block; background-color:#f79632">{{#stockOptions}}{{{stockOptions}}}{{/stockOptions}}{{^stockOptions}}{{#restrictedStockPurchase}}{{{restrictedStockPurchase}}}{{/restrictedStockPurchase}}{{^restrictedStockPurchase}}[stock option] OR [restricted stock purchase]{{/restrictedStockPurchase}}{{/stockOptions}}</div> agreement,
            which Advisor will be required to sign (the "<u>Stock Agreement</u>").</p>
    </li>
</ol>
<p style="color: black;">So long as Advisor's Continuous Service Status (as defined in the Plan) does not terminate, Advisor will vest in <div style="display: inline-block; background-color:#f79632">{{percentageVest}}</div>% of the shares on the <div style="display: inline-block; background-color:#f79632">{{anniversaryMonth}}</div>-month anniversary of Advisor's vesting commencement date and [1/48<sup>th</sup>] of the total
    shares will vest in monthly installments thereafter during continuous service, as described in the Stock Agreement. <div style="display: inline-block; background-color:#f79632">{{#typeOfTriggerAcceleration}}{{{typeOfTriggerAcceleration}}}{{/typeOfTriggerAcceleration}}{{^typeOfTriggerAcceleration}}[Single Trigger Acceleration] OR [Double Trigger Acceleration]{{/typeOfTriggerAcceleration}}</div> If Advisor’s services are terminated by the Company in connection with or following the consummation of a Change of Control (as defined in the Stock Agreement or Plan), then <div style="display: inline-block; background-color:#f79632">{{percentageVestTrigger}}</div>% of Advisor's then unvested shares will immediately vest (i.e., double trigger acceleration). The <div style="display: inline-block; background-color:#f79632">{{#exercise}}{{{exercise}}}{{/exercise}}{{^exercise}}{{#purchase}}{{{purchase}}}{{/purchase}}{{^purchase}}[exercise] OR [purchase]{{/purchase}}{{/exercise}}</div> price per share
    will be equal to the fair market value per share on the date the <div style="display: inline-block; background-color:#f79632">{{#option}}{{{option}}}{{/option}}{{^option}}{{#restrictedStockPurchaseAwards}}{{{restrictedStockPurchaseAwards}}}{{/restrictedStockPurchaseAwards}}{{^restrictedStockPurchaseAwards}}[option] OR [restricted stock purchase awards]{{/restrictedStockPurchaseAwards}}{{/option}}</div> is granted, as determined by the Company's Board of Directors in good faith [compliance with applicable guidance
    in order to avoid having the option be treated as deferred compensation under Section 409A of the Internal Revenue Code of 1986, as amended]. There is no guarantee that the Internal Revenue Service will agree with this value. Advisor should consult
    with Advisor's own tax advisor concerning the tax risks associated with accepting <div style="display: inline-block; background-color:#f79632">{{acceptionOption}}</div> to purchase the Company's common stock. Advisor shall have no right to any compensation except as set forth in
    this Section 2.</p>
<ol start="3">
    <li>
        <p style="color: black;"><u><strong>Expenses</strong></u>. The Company shall reimburse Advisor for reasonable expenses incurred in the course of performing services hereunder, provided, however, that all expenses shall be approved in advance by the Company. As a condition
            to receipt of reimbursement, Advisor shall be required to submit to the Company reasonable evidence that the amount involved was both reasonable and necessary to the Services provided under this Agreement.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Term and Termination</strong></u>. The term of this Agreement shall be for a period of <div style="display: inline-block; background-color:#f79632">{{numberOfYears}}</div> years from the date hereof and may be renewed by mutual agreement of the parties; <u>provided</u>, <u>however</u>, that this Agreement may be
            terminated by either party for any reason upon five (5) business days prior written notice without further obligation or liability.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Independent Contractor</strong></u>. Advisor's relationship with the Company will be that of an independent contractor and not that of an employee. Advisor will not be eligible for any employee benefits, nor will the Company make
            deductions from payments made to Advisor for employment or income taxes, all of which will be Advisor's responsibility. Advisor agrees to indemnify and hold the Company harmless from any liability for, or assessment of, any such taxes
            imposed on the Company by relevant taxing authorities. Advisor will have no authority to enter into contracts that bind the Company or create obligations on the part of the Company without the prior written authorization of the Company.</p>
    </li>
    <li>
        <p style="color: black;" align="justify"><u><strong>Nondisclosure of Confidential Information</strong></u>.</p>
        <ol type="a">
            <li>
                <p style="color: black;"><u><strong>Agreement Not to Disclose</strong></u><strong>.</strong> Advisor agrees not to use any Confidential Information (as defined below) disclosed to Advisor by the Company for Advisor's own use or for any purpose other than
                    to carry out discussions concerning, and the undertaking of, the Services. Advisor shall not disclose or permit disclosure of any Confidential Information of the Company to third parties. Advisor agrees to take all reasonable measures
                    to protect the secrecy of and avoid disclosure or use of Confidential Information of the Company in order to prevent it from falling into the public domain or the possession of persons other than those persons authorized under this
                    Agreement to have any such information. Advisor further agrees to notify the Company in writing of any actual or suspected misuse, misappropriation or unauthorized disclosure of the Company's Confidential Information which may
                    come to Advisor's attention.</p>
            </li>
            <li>
                <p style="color: black;"><u><strong>Definition of Confidential Information</strong></u><strong>.</strong> "<u>Confidential Information</u>" means any information, technical data or know-how (whether disclosed before or after the date of this Agreement),
                    including, but not limited to, information relating to business and product or service plans, financial projections, customer lists, business forecasts, sales and merchandising, human resources, patents, patent applications, computer
                    object or source code, research, inventions, processes, designs, drawings, engineering, marketing or finance to be confidential or proprietary or which information would, under the circumstances, appear to a reasonable person to be
                    confidential or proprietary. Confidential Information does not include information, technical data or know-how which: (i)&nbsp;is in the possession of Advisor at the time of disclosure, as shown by Advisor's files and records
                    immediately prior to the time of disclosure; or (ii)&nbsp;becomes part of the public knowledge or literature, not as a direct or indirect result of any improper inaction or action of Advisor.</p>
            </li>
            <li>
                <p style="color: black;"><u><strong>Exceptions</strong></u><strong>.</strong> Notwithstanding the above, Advisor shall not have liability to the Company or any of its subsidiaries with regard to any Confidential Information of the Company which Advisor can prove:</p>
                <ol type="i">
                    <li>
                        <p style="color: black;">is disclosed with the prior written approval of the Company; or</p>
                    </li>
                    <li>
                        <p style="color: black;">is disclosed pursuant to the order or requirement of a court, administrative agency, or other governmental body; provided, however, that Advisor shall provide prompt notice of such court order or requirement to the Company to enable
                            the Company or its appropriate subsidiary to seek a protective order or otherwise prevent or restrict such disclosure.</p>
                    </li>
                </ol>
            </li>
        </ol>
    </li>
    <li>
        <p style="color: black;"><u><strong>No Duplication; Return of Materials</strong></u>. Advisor agrees, except as otherwise expressly authorized by the Company, not to make any copies or duplicates of any of the Company's Confidential Information. Any materials or
            documents that have been furnished by the Company to Advisor in connection with the Services shall be promptly returned by Advisor to the Company, accompanied by <u>all</u> copies of such documentation, within ten days after the earlier of
            (a)&nbsp;the date on which the Services have been concluded or (b)&nbsp;the date of written request of the Company.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>No Rights Granted</strong></u>. Nothing in this Agreement shall be construed as granting any rights under any patent, copyright or other intellectual property right of the Company, nor shall this Agreement grant Advisor any rights in
            or to the Company's Confidential Information, except the limited right to use the Confidential Information in connection with the Services.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Assignment of Inventions</strong></u>. To the extent that, in connection with performing the Services, Advisor jointly or solely conceives, develops, or reduces to practice any inventions, original works of authorship, developments,
            concepts, know-how, improvements or trade secrets, whether or not patentable or registrable under copyright or similar laws, Advisor hereby assigns all rights, titles and interest to such inventions to the Company.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Duty to Assist</strong></u>. As requested by the Company, Advisor shall take all steps reasonably necessary to assist the Company in obtaining and enforcing in its own name any patent, copyright or other protection which the Company
            elects to obtain or enforce for its inventions, original works of authorship, developments, concepts, know-how, improvements and trade secrets. Advisor's obligation to assist the Company in obtaining and enforcing patents, copyrights
            and other protections shall continue beyond the termination of Advisor's relationship with the Company, but the Company shall compensate Advisor at a reasonable rate after the termination of such relationship for time actually spent
            at the Company's request providing such assistance.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>No Conflicts</strong></u>. Advisor represents that Advisor's compliance with the terms of this Agreement and provision of Services hereunder will not violate any duty which Advisor may have to any other person or entity (such
            as a present or former employer), including obligations concerning providing services to others, confidentiality of proprietary information and assignment of inventions, ideas, patents or copyrights, and Advisor agrees that Advisor will not
            do anything in the performance of Services hereunder that would violate any such duty. In addition, Advisor agrees that, during the term of this Agreement, prior to performing any services for or otherwise participating in a company developing
            or commercializing new software, services, methods, devices, or other technology that may be competitive with the Company, Advisor shall first notify the Company in writing. It is understood that in such event, the Company will review whether
            Advisor's activities are consistent with Advisor continuing to provide Services to the Company.</p>
    </li>
    <li>
        <p style="color: black;"><u><strong>Miscellaneous</strong></u>. Any term of this Agreement may be amended or waived only with the written consent of the parties. This Agreement, including any exhibits hereto, constitutes the sole agreement of the parties and supersedes
            all oral negotiations and prior writings with respect to the subject matter hereof. Any notice required or permitted by this Agreement shall be in writing and shall be deemed sufficient upon delivery, when delivered personally or by overnight
            courier or sent by e-mail or fax (with customary confirmation of receipt), or 48 hours after being deposited in the U.S. mail as certified or registered mail (airmail if sent internationally) with postage prepaid, addressed to the party to
            be notified at such party's address or fax number as set forth on the signature page herein, or as subsequently modified by written notice. The validity, interpretation, construction and performance of this Agreement shall be governed
            by the laws of the state of <div style="display: inline-block; background-color:#f79632">{{#stateOfAdvisor}}{{{stateOfAdvisor}}}{{/stateOfAdvisor}}{{^stateOfAdvisor}}[STATE]{{/stateOfAdvisor}}
            </div>, without giving effect to the principles of conflict of laws. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together will constitute one and
            the same instrument.</p>
    </li>
</ol>
<p style="color: black;" align="center"><em>[Signature Page Follows]</em></p>
<p style="color: black;">The parties have executed this Agreement as of the date first written above.</p>
<p style="color: black;"><strong>THE COMPANY: <span><div style="display: inline-block; background-color:#f79632">{{#companyName}}{{{companyName}}}{{/companyName}}{{^companyName}}[COMPANY NAME]{{/companyName}}</div></span></strong></p>
<p style="color: black;">(Signature)</p>
<p style="color: black;">________________________________________ </p>
<p style="color: black;">Name: <span id="partyName"><div style="display: inline-block; background-color:#f79632">{{partyName}}</div></span></p>
<p style="color: black;">Email: <span id="partyEmail"><div style="display: inline-block; background-color:#f79632">{{partyEmail}}</div></span></p>
<p style="color: black;">Address: <div style="display: inline-block; background-color:#f79632"><span id="partyAddress">{{partyAddress}}</span></div></p>
<p style="color: black;">Wallet: <div style="display: inline-block; background-color:#f79632"><span id="partyWallet">{{partyWallet}}</span></div></p>
<br /> <br /> 
<p style="color: black;"><strong>ADVISOR:</strong></p>
<p style="color: black;">(Signature)</p>
<br /> ________________________________________ 
<p style="color: black;">Name: <div style="display: inline-block; background-color:#f79632"><span id="counterPartyName">{{#counterPartyName}}{{{counterPartyName}}}{{/counterPartyName}}{{^counterPartyName}}[ADVISOR NAME]{{/counterPartyName}}</span></div></p>
<p style="color: black;">Email: <div style="display: inline-block; background-color:#f79632"><span id="counterPartyEmail">{{counterPartyEmail}}</span></div></p>
<p style="color: black;">Address: <div style="display: inline-block; background-color:#f79632"><span id="counterPartyAddress">{{counterPartyAddress}}</span></div>
<p style="color: black;">Wallet: <div style="display: inline-block; background-color:#f79632"><span id="counterPartyWallet">{{counterPartyWallet}}</span></div>
<p style="color: black;" align="center"><br /> </p>
</div>`;

export default AdvisorAgreemt;
