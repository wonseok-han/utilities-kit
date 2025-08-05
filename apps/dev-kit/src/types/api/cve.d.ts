type CVEDataType = {
  id: string;
  description: string;
  severity: string;
  publishedDate: string;
  lastModifiedDate: string;
  cvssScore?: number;
  references: string[];
  affectedProducts: string[];
};

type NVDVulnerabilityType = {
  cve: {
    id: string;
    descriptions: Array<{
      lang: string;
      value: string;
    }>;
    published: string;
    lastModified: string;
    references: Array<{
      url: string;
    }>;
    configurations: Array<{
      nodes: Array<{
        cpeMatch: Array<{
          criteria: string;
        }>;
      }>;
    }>;
    metrics?: {
      cvssMetricV31?: Array<{
        cvssData: {
          baseSeverity: string;
          baseScore: number;
        };
      }>;
      cvssMetricV30?: Array<{
        cvssData: {
          baseSeverity: string;
          baseScore: number;
        };
      }>;
    };
  };
};

type NVDResponseType = {
  vulnerabilities?: NVDVulnerabilityType[];
};
