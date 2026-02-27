import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout';
import HomePage from './app/page';
import NewsDetail from './app/news/[id]/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="news/:id" element={<NewsDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}