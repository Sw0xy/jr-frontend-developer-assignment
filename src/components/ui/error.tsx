import { ApolloError } from "@apollo/client";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

type ErrorProps = {
  error: ApolloError;
};

export const Error = ({ error }: ErrorProps) => {
  return (
    <div className="p-2 rounded-lg bg-red-500/10 flex items-center gap-x-2 border border-red-500 mt-8">
      <div className="w-5 h-5">
        <QuestionMarkCircledIcon className="text-red-500 w-full h-full" />
      </div>
      <span className="text-red-500 text-sm font-medium">{error.message}</span>
    </div>
  );
};
