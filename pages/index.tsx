// import type { NextPage } from "next";
import Head from "next/head";
import TheHeader from "../components/home/TheHeader";
import PsychologistsService from "../services/PsychologistsService";
import useDebounce from "../hooks/useDebounce";
import LoadMore from "../components/home/LoadMore";
import TheCard from "../components/home/TheCard";
import { Psychologist, Data } from "../types";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import TheModal from "../components/global/TheModal";
import DropdownBtn from "../components/global/DropdownBtn";
import AllFilters from "../components/home/AllFilters";
import TheDropdownOptionsIds from "../components/home/TheDropdownOptionsIds";
import TheDropdownOptionsName from "../components/home/TheDropdownOptionsName";
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";

const Home = (props: any, ref: any) => {
  const {
    loading,
    setLoading,
    showLogin,
  }: {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    showLogin: any;
  } = props;

  useImperativeHandle(ref, () => ({
    getAlert() {
      showLogin();
    },
  }));

  const [psychologists, setPsychologists] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [hasPerspective, setHasPerspective] = useState<string | undefined>(
    "si"
  );
  const [pagination, setPagination] = useState(1);
  const [selectedOptionsSp, setSelectedOptionsSp] = useState<Data[]>([]);
  const [selectedOptionsTm, setSelectedOptionsTm] = useState<Data[]>([]);
  const [selectedOptionsWp, setSelectedOptionsWp] = useState<Data[]>([]);
  const [selectedOptionsWm, setSelectedOptionsWm] = useState<Data[]>([]);
  const [selectedOptionEd, setSelectedOptionEd] = useState<any>({});
  const [selectedOptionGi, setSelectedOptionGi] = useState<any>({});

  const [sp, setSp] = useState<Data[]>([]);
  const [tm, setTm] = useState<Data[]>([]);
  const [wp, setWp] = useState<Data[]>([]);
  const [wm, setWm] = useState<Data[]>([
    {
      id: 1,
      name: "Individual",
    },
    {
      id: 2,
      name: "Pareja",
    },
    {
      id: 3,
      name: "Familiar",
    },
    {
      id: 4,
      name: "Grupal",
    },
  ]);
  const [ed, setEd] = useState<Data[]>([]);
  const [gi, setGi] = useState<Data[]>([]);

  const { userInfo } = useSelector((state: any) => state.userReducer);

  const debouncedName = useDebounce(name, 1000);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      setName(target.value);
    }
  };

  const handleHpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      if (target.checked) {
        setHasPerspective("si");
      } else {
        setHasPerspective("no");
      }
    }
  };

  const createVariables = () => {
    const selectedOptionsIdsSp = selectedOptionsSp.map((item) => item.id);
    const selectedOptionsIdsTm = selectedOptionsTm.map((item) => item.id);
    const selectedOptionsIdsWp = selectedOptionsWp.map((item) => item.id);
    const selectedOptionsIdsWm = selectedOptionsWm.map((item) => item.id);
    const selectedOptionNameEd = selectedOptionEd.name;
    const selectedOptionNameGi = selectedOptionGi.name;
    return {
      selectedOptionsIdsSp,
      selectedOptionsIdsTm,
      selectedOptionsIdsWp,
      selectedOptionsIdsWm,
      selectedOptionNameEd,
      selectedOptionNameGi,
    };
  };

  const {
    selectedOptionsIdsSp,
    selectedOptionsIdsTm,
    selectedOptionsIdsWp,
    selectedOptionsIdsWm,
    selectedOptionNameEd,
    selectedOptionNameGi,
  } = createVariables();

  const fetchPsychologists = async () => {
    setLoading(true);
    const data = (
      await PsychologistsService.index(
        1,
        debouncedName,
        selectedOptionsIdsSp,
        selectedOptionsIdsTm,
        selectedOptionsIdsWp,
        selectedOptionsIdsWm,
        selectedOptionNameEd,
        selectedOptionNameGi,
        hasPerspective
      )
    ).data;
    setPsychologists(data.results);
    setLoading(false);
    setPagination(1);
    setNoMore(false);
  };

  const fetchMorePsychologists = async () => {
    try {
      setLoadingMore(true);
      const data = (
        await PsychologistsService.index(
          pagination,
          debouncedName,
          selectedOptionsIdsSp,
          selectedOptionsIdsTm,
          selectedOptionsIdsWp,
          selectedOptionsIdsWm,
          selectedOptionNameEd,
          selectedOptionNameGi,
          hasPerspective
        )
      ).data;
      setPsychologists((psychologists) => psychologists.concat(data.results));
      setLoadingMore(false);
      setNoMore(false);
    } catch (errors) {
      console.log("errors.response.data", errors.response.data);
      setLoadingMore(false);
      setPagination(1);
      setNoMore(true);
    }
  };

  const handlePagination = () => {
    setPagination(pagination + 1);
  };

  useEffect(() => {
    fetchPsychologists();
  }, [
    debouncedName,
    selectedOptionsSp,
    selectedOptionsTm,
    selectedOptionsWp,
    selectedOptionsWm,
    selectedOptionEd,
    selectedOptionGi,
    hasPerspective,
    userInfo,
  ]);

  useEffect(() => {
    if (pagination > 1) {
      fetchMorePsychologists();
    }
  }, [pagination]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Psievidencia</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Una aplicación web para ayudarte a encontrar a los mejores psicólogos basados en la evidencia."
        />
        <meta name="keywords" content="psievidencia psicologia evidencia" />
        <meta
          name="google-site-verification"
          content="SunVWUveAt2rjkQwOP05PRn3LsPQ8T24-Aji_ACkSik"
        />
        {/* <meta name="twitter:image:src" content="" />
        <meta property="og:image" content="" /> */}
      </Head>
      <div className="container mx-auto px-5 sm:px-0 pt-20 pb-40 main-content">
        <TheHeader />

        <AllFilters
          className="hidden sm:block"
          handleNameChange={handleNameChange}
          handleHpChange={handleHpChange}
          hasPerspective={hasPerspective}
          selectedOptionsSp={selectedOptionsSp}
          setSelectedOptionsSp={setSelectedOptionsSp}
          selectedOptionsTm={selectedOptionsTm}
          setSelectedOptionsTm={setSelectedOptionsTm}
          selectedOptionsWp={selectedOptionsWp}
          setSelectedOptionsWp={setSelectedOptionsWp}
          selectedOptionsWm={selectedOptionsWm}
          setSelectedOptionsWm={setSelectedOptionsWm}
          selectedOptionEd={selectedOptionEd}
          setSelectedOptionEd={setSelectedOptionEd}
          selectedOptionGi={selectedOptionGi}
          setSelectedOptionGi={setSelectedOptionGi}
          sp={sp}
          setSp={setSp}
          tm={tm}
          setTm={setTm}
          wp={wp}
          setWp={setWp}
          wm={wp}
          setWm={setWm}
          ed={ed}
          setEd={setEd}
          gi={gi}
          setGi={setGi}
        />

        <div className="sm:hidden flex justify-end">
          <TheModal
            modalCentered={true}
            modalMask={true}
            button={<DropdownBtn />}
            title={"Filtrar"}
            content={
              <AllFilters
                handleNameChange={handleNameChange}
                handleHpChange={handleHpChange}
                hasPerspective={hasPerspective}
                selectedOptionsSp={selectedOptionsSp}
                setSelectedOptionsSp={setSelectedOptionsSp}
                selectedOptionsTm={selectedOptionsTm}
                setSelectedOptionsTm={setSelectedOptionsTm}
                selectedOptionsWp={selectedOptionsWp}
                setSelectedOptionsWp={setSelectedOptionsWp}
                selectedOptionsWm={selectedOptionsWm}
                setSelectedOptionsWm={setSelectedOptionsWm}
                selectedOptionEd={selectedOptionEd}
                setSelectedOptionEd={setSelectedOptionEd}
                selectedOptionGi={selectedOptionGi}
                setSelectedOptionGi={setSelectedOptionGi}
                sp={sp}
                setSp={setSp}
                tm={tm}
                setTm={setTm}
                wp={wp}
                setWp={setWp}
                wm={wp}
                setWm={setWm}
                ed={ed}
                setEd={setEd}
                gi={gi}
                setGi={setGi}
              />
            }
          />
        </div>

        <TheDropdownOptionsIds
          selectedOptions={selectedOptionsSp}
          setSelectedOptions={setSelectedOptionsSp}
          setData={setSp}
        />
        <TheDropdownOptionsIds
          selectedOptions={selectedOptionsTm}
          setSelectedOptions={setSelectedOptionsTm}
          setData={setTm}
        />
        <TheDropdownOptionsIds
          selectedOptions={selectedOptionsWp}
          setSelectedOptions={setSelectedOptionsWp}
          setData={setWp}
        />
        <TheDropdownOptionsIds
          selectedOptions={selectedOptionsWm}
          setSelectedOptions={setSelectedOptionsWm}
          setData={setWm}
        />
        <TheDropdownOptionsName
          selectedOption={selectedOptionEd}
          setSelectedOption={setSelectedOptionEd}
          setData={setEd}
        />
        <TheDropdownOptionsName
          selectedOption={selectedOptionGi}
          setSelectedOption={setSelectedOptionGi}
          setData={setGi}
        />

        {psychologists != null && psychologists.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {psychologists.map((psychologist: Psychologist) => {
                return (
                  <TheCard
                    key={psychologist.id}
                    psychologist={psychologist}
                    update={fetchPsychologists}
                    showLogin={showLogin}
                  />
                );
              })}
            </div>
            {!loading && (
              <LoadMore
                handlePagination={handlePagination}
                noMore={noMore}
                loadingMore={loadingMore}
              />
            )}
          </>
        ) : (
          <div className="grid place-items-center text-2xl h-56">
            <FormattedMessage id="no.results" />
          </div>
        )}
      </div>
    </>
  );
};

export default React.forwardRef(Home);
