import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout';
import HomePage from './app/page';
import NewsDetail from './app/news/[id]/page';
import PrivacyPolicy from './app/privacy/page';
import TermsConditions from './app/terms/page';
import ContactUs from './app/contact/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}