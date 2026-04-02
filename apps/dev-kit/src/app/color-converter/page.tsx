import { PageWrapper } from '@components/page-wrapper';

import { ColorConverterClient, ColorConverterHeader } from './components';

export default function ColorConverterPage() {
  return (
    <PageWrapper>
      <ColorConverterHeader />
      <ColorConverterClient />
    </PageWrapper>
  );
}
