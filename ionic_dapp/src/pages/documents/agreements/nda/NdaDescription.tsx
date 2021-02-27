import {
	IonItem,
	IonButton,
	IonText,
	//IonModal,
} from '@ionic/react';
import React, { useState, useEffect} from 'react';

interface DescriptionProps {
	title: string;
	current: any;
}

const NdaDescription: React.FC<DescriptionProps> = ({ title, current }) => {
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	async function slideNext() {
		await current.updateAutoHeight();
		await current.lockSwipeToNext(false);
		current.slideNext();
		await current.lockSwipeToNext(true);
	}

	return (
		<div className="agreement-content vehicle-agreement-instructions">
			<IonItem>
				<div className="instructions">
				<div>
					<h5 className="instructions-title first">{title}</h5>
					<IonText color="secondary" class="instructions-sub-text first">
					This document will serve as the official document for Disclosure 
					to agree to share information with a Recipient under the following
					terms and conditions:
					</IonText>
					<ul className="instructions-list first">
					<li>
						<strong>Definition of Confidential Information.</strong>  “Confidential 
						Information” means information and physical material not generally known 
						or available outside Discloser and information and physical material entrusted
						to Discloser in confidence by third parties. Confidential Information includes, 
						without limitation:  technical data, trade secrets, know-how, research, product
						or service ideas or plans, software codes and designs, algorithms, developments,
						inventions, patent applications, laboratory notebooks, processes, formulas,
						techniques, mask works, engineering designs and	drawings, hardware configuration
						information, agreements with third parties,lists of, or information relating to, 
						employees and consultants of the Discloser (including, but not limited to, the names,
						contact information, jobs, compensation, and expertise of such employees and 
						consultants), lists of, or information relating	to, suppliers and customers, price
						lists, pricing methodologies, cost data, market share data, marketing plans, licenses,
						contract information, business plans, financial forecasts, historical financial
						data, budgets or other business information disclosed by Discloser (whether by
						 oral, written, graphic or machine-readable format).
						</li>
					</ul>
					<h5 color="secondary" className="instructions-title third">
						Other terms and conditions:
					</h5>
					<ul className="instructions-list first">
						<li>
						    <strong>Return of Materials.</strong> Recipient shall, except as otherwise expressly authorized by Discloser,
							not make any copies or duplicates of any Confidential Information.
							Any materials or documents that have been furnished by Discloser to
							Recipient in connection with the Relationship shall be promptly 
							returned by Recipient, accompanied by all copies of such documentation, 
							within ten (10) days after (a)the Relationship has been rejected 
							or concluded or (b)the written request of Discloser.
						</li>
						<li>
						    <strong>No Reverse Engineering.</strong> Recipient shall not modify, 
							reverse engineer, decompile, create other works from or disassemble 
							any software programs contained in the Confidential Information of 
							Discloser unless permitted in writing by Discloser. 
						</li>
						<li>
							<strong>Definition of Confidential Information.</strong>  “Confidential 
							Information” means information and physical material not generally known 
							or available outside Discloser and information and physical material entrusted
							to Discloser in confidence by third parties. Confidential Information includes, 
							without limitation:  technical data, trade secrets, know-how, research, product
							or service ideas or plans, software codes and designs, algorithms, developments,
							inventions, patent applications, laboratory notebooks, processes, formulas,
							techniques, mask works, engineering designs and	drawings, hardware configuration
							information, agreements with third parties,lists of, or information relating to, 
							employees and consultants of the Discloser (including, but not limited to, the names,
							contact information, jobs, compensation, and expertise of such employees and 
							consultants), lists of, or information relating	to, suppliers and customers, price
							lists, pricing methodologies, cost data, market share data, marketing plans, licenses,
							contract information, business plans, financial forecasts, historical financial
							data, budgets or other business information disclosed by Discloser (whether by
							oral, written, graphic or machine-readable format).
							</li>
						</ul>
						<h5 color="secondary" className="instructions-title third">
							Other terms and conditions:
						</h5>
						<ul className="instructions-list first">
							<li>
								<strong>Return of Materials.</strong> Recipient shall, except as otherwise expressly authorized by Discloser,
								not make any copies or duplicates of any Confidential Information.
								Any materials or documents that have been furnished by Discloser to
								Recipient in connection with the Relationship shall be promptly 
								returned by Recipient, accompanied by all copies of such documentation, 
								within ten (10) days after (a)the Relationship has been rejected 
								or concluded or (b)the written request of Discloser.
							</li>
							<li>
								<strong>No Reverse Engineering.</strong> Recipient shall not modify, 
								reverse engineer, decompile, create other works from or disassemble 
								any software programs contained in the Confidential Information of 
								Discloser unless permitted in writing by Discloser. 
							</li>
							<li>
								<strong>Term.</strong> The foregoing commitments of each party shall 
								survive any termination ofthe Relationship between the parties, and 
								shall continue for a period terminating five(5) years from the date 
								on which Confidential Information is last disclosed under this Agreement. 
							</li>
						</ul>
					</div>
					<div>
						<IonButton
							onClick={() => {
								slideNext();
							}}
							color="gradient"
							shape="round">
							Continue
						</IonButton>
					</div>
				</div>
			</IonItem>
		</div>
	);
};

export default NdaDescription;
