import { Routes, Route, Navigate } from 'react-router-dom';
import { List } from './List';
import { EditPage } from './EditPage';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/list" element={<List />} />
      <Route path="/template/:templateId" element={<EditPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export { Routing };
