import React, { Children } from 'react';
import { Progress } from 'reactstrap';

const Wizard = ({
  children, activePageIndex, jsonSchemas, title,
}) => {
  const pages = Children.toArray(children);
  const currentPage = pages[activePageIndex];
  return (
    <>
      <p className="mb-3">{title}</p>
      <span>
        Step
        {' '}
        {activePageIndex + 1}
        {' '}
        of
        {' '}
        {jsonSchemas.length}
        {' '}
        {jsonSchemas[activePageIndex].title}
      </span>
      <Progress color="danger" value={activePageIndex + 1} max={jsonSchemas.length} />
      <div>{currentPage}</div>
    </>
  );
};

export default Wizard;
