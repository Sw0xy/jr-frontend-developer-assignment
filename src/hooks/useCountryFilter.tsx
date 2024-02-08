import { gql, useQuery } from "@apollo/client";

export const useCountryFilter = (text: { [key: string]: string }) => {
  const obj = text;

  let filterArguments = "";
  if (Object.keys(obj).length > 0) {
    const filterFields = Object.entries(obj)
      .map(([key, value]) => `${key}: { eq: "${value}" }`)
      .join(", ");
    filterArguments = `(filter: { ${filterFields} })`;
  }

  const FILTER = gql`
    query Search {
      countries${filterArguments} {
        name
        emoji
        currency
      }
    }
  `;

  return useQuery(FILTER);
};
