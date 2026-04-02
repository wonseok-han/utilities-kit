import { PageWrapper } from '@components/page-wrapper';

import { UrlEncoderClient, UrlEncoderHeader } from './components';

export default function UrlEncoderPage() {
  return (
    <PageWrapper>
      <UrlEncoderHeader />
      <UrlEncoderClient />
    </PageWrapper>
  );
}
