import { ApolloError } from "@apollo/client";
import {
  CheckIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import ld from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Error } from "./components/ui/error";
import { Input } from "./components/ui/input";
import { Loading } from "./components/ui/loading";
import { ScrollArea } from "./components/ui/scroll-area";
import { useCountryFilter } from "./hooks/useCountryFilter";
import { getRandomColor } from "./lib/utils";

type Country = {
  currency: string;
  name: string;
  emoji: string;
  __typename: string;
};

export const App = () => {
  const [selectedItems, setSelectedItems] = useState<Country[]>([]);
  const [searchText, setSearchText] = useState("");
  const [inputData, setInput] = useState({});
  const { data, loading, error } = useCountryFilter(inputData);

  const debouncer = useCallback(ld.debounce(setInput, 1000), []);

  useEffect(() => {
    const parseInput = () => {
      const regex = /(\w+):\s*([^,]+)(?:,|$)/g;
      const result: { [key: string]: string } = {};

      let match;
      while ((match = regex.exec(searchText)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (value.length > 1) {
          result[key] = value;
        }
        debouncer(result);
      }
    };
    parseInput();
  }, [debouncer, searchText]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="antialiased min-h-screen">
        <div className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
          <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/50 p-4 sm:p-8 border border-border/50">
            <div className="flex justify-between py-4">
              <h1 className="text-2xl font-semibold text-white">
                Country Filter
              </h1>
              <Button
                variant={"secondary"}
                className="text-sm ml-2 w-max text-muted-foreground gap-x-2 items-center inline-flex"
              >
                {selectedItems.length}
                <GlobeIcon />
              </Button>
            </div>
            <div className="flex items-center">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={(e) => {
                    e.preventDefault();
                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                  className="pl-8 w-full"
                  placeholder="name: Turkey,currency: TRY"
                />
              </div>
            </div>
            {data?.countries && (
              <CountryList
                data={data.countries}
                isLoading={loading}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                error={error}
              />
            )}
            <footer className="text-sm text-muted-foreground text-center mt-auto">
              Built by{" "}
              <a href="https://swoxy.dev" className="underline mr-1">
                Swoxy
              </a>
              The source code is available on
              <a href="" className="underline ml-1">
                GitHub.
              </a>
            </footer>
          </div>
        </div>
      </main>
      <div
        className="fixed inset-0 z-[-1] bg-transparent h-screen w-screen"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--muted)), hsl(var(--background)))",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundSize: "50px 50px",
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, hsl(var(--muted)/80%) 25%, hsl(var(--muted)/80%) 26%, transparent 27%, transparent 74%, hsl(var(--muted)/80%) 75%, hsl(var(--muted)/80%) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, hsl(var(--muted)/80%) 25%, hsl(var(--muted)/80%) 26%, transparent 27%, transparent 74%, hsl(var(--muted)/80%) 75%, hsl(var(--muted)/80%) 76%, transparent 77%, transparent)",
          }}
        />
      </div>
    </ThemeProvider>
  );
};

type CountryListProps = {
  data: Country[];
  isLoading: boolean;
  error: ApolloError | undefined;
  setSelectedItems: React.Dispatch<React.SetStateAction<Country[]>>;
  selectedItems: Country[];
};

const CountryList: React.FC<CountryListProps> = ({
  data,
  isLoading,
  error,
  setSelectedItems,
  selectedItems,
}) => {
  useEffect(() => {
    if (data.length === 1) {
      setSelectedItems((oldData) => [...oldData, { ...data[0] }]);
    } else if (data.length > 9) {
      setSelectedItems((oldData) => [...oldData, { ...data[9] }]);
    }
  }, [data]);

  const onChecked = useCallback(
    ({ item, isSelected }: { item: Country; isSelected: boolean }) =>
      setSelectedItems((oldData) =>
        isSelected
          ? oldData.filter((country: Country) => country.name !== item.name)
          : [...oldData, { ...item }]
      ),
    [setSelectedItems]
  );

  const selectedItemsMap: Record<string, boolean> = selectedItems.reduce(
    (acc: Record<string, boolean>, item) => {
      acc[item.name] = true;
      return acc;
    },
    {}
  );

  if (isLoading) return <Loading />;
  if (error) <Error error={error} />;
  return (
    <ScrollArea className="h-[60vh] shadow-md overflow-auto mt-4 p-4 scroll-smooth rounded-lg border border-muted/80">
      {data.map((item, index) => {
        const itemIsSelected: boolean = !!selectedItemsMap[item.name];

        return (
          <CountryCard
            key={index}
            item={item}
            onChecked={onChecked}
            isSelected={itemIsSelected}
          />
        );
      })}
    </ScrollArea>
  );
};

type CountryCardProps = {
  item: Country;
  isSelected: boolean;
  onChecked: ({
    item,
    isSelected,
  }: {
    item: Country;
    isSelected: boolean;
  }) => void;
};

const CountryCard: React.FC<CountryCardProps> = memo(
  ({ item, onChecked, isSelected }) => {
    return (
      <button
        onClick={() => {
          onChecked({ isSelected, item });
        }}
        style={{ backgroundColor: isSelected ? getRandomColor() : "" }}
        className={clsx(
          "flex items-center justify-between w-full hover:bg-secondary group bg-muted/10 transition-all duration-200 mt-2 text-secondary-foreground py-2 px-4 rounded-md border border-border"
        )}
      >
        <div className="flex items-center gap-x-2">
          {item.emoji}
          <span className="text-base font-semibold">{item.name}</span>
        </div>
        {isSelected && <CheckIcon fontSize={38} />}
      </button>
    );
  }
);
