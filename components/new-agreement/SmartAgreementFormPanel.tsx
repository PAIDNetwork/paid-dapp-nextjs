import React, { FC } from 'react';
import { Card, Button } from 'reactstrap';
import SmartAgreementForm from './SmartAgreementForm';

interface SmartAgreementsFormPanelProps {
  jsonSchemas: Array<Object>;
  uiSchema: Object;
  dataName: string;
  title: string;
  type: string;
  onChangeFields: any;
  activePageIndex: number,
  setActivePageIndex: any,
  onReview: any;
}

const SmartAgreementsFormPanel: FC<SmartAgreementsFormPanelProps> = ({
  type,
  dataName,
  title,
  jsonSchemas,
  uiSchema,
  onChangeFields,
  activePageIndex,
  setActivePageIndex,
  onReview,
}: SmartAgreementsFormPanelProps) => (
  <Card className="card-fields border-0 p-3">
    {/* <div className="title d-flex">
      <span className="mr-auto p-2 mb-4"> Fields</span>
      <Button className="btn-transparent" color="primary">
        <img src="/assets/icon/3dot.svg" alt="" />
      </Button>
    </div> */}
    <SmartAgreementForm
      type={type}
      dataName={dataName}
      title={title}
      jsonSchemas={jsonSchemas}
      uiSchema={uiSchema}
      onChangeFields={onChangeFields}
      onReview={onReview}
      activePageIndex={activePageIndex}
      setActivePageIndex={setActivePageIndex}
    />
  </Card>
);

// SmartAgreementsFormPanel.propTypes = {
//   data: PropTypes.oneOfType([PropTypes.any]),
// };

// SmartAgreementsFormPanel.defaultProps = {
//   data: [],
// };

export default SmartAgreementsFormPanel;
