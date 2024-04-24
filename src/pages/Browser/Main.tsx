import Banner from "../../components/common/Browser/Banner";
import CardContainer from "../../components/common/Browser/CardContainer";
import { getCoffeeCafesAPI } from "../../apis/api";
import { useQueries, useQuery } from "react-query";
import { useEffect } from "react";
import { isBrowser } from "react-device-detect";

export default function Main() {
  // const result = useQueries([
  //   {
  //     queryKey: ["getCoffeeCafesScore"],
  //     queryFn: () => getCoffeeCafesAPI(1),
  //   },
  //   {
  //     queryKey: ["getCoffeeCafesOpt"],
  //     queryFn: () => getCoffeeCafesAPI(2),
  //   },
  // ]);
  const { isLoading, data: oneData } = useQuery({
    queryKey: ["getCoffeeCafesScore"],
    queryFn: () => getCoffeeCafesAPI(1),
  });
  const { data: twoData } = useQuery({
    queryKey: ["getCoffeeCafesOpt"],
    queryFn: () => getCoffeeCafesAPI(2),
  });
  if (isLoading) return <></>;
  if (isBrowser)
    return (
      <>
        <div className="">
          <div>
            <Banner />
          </div>
          <div className="pl-[10%] pr-[10%]">
            <div className="flex flex-row w-full">
              <div className="w-[1280px] ">
                {oneData !== undefined && (
                  <CardContainer
                    title={"🔥 핫플, 인기 있는 카페"}
                    data={oneData}
                    type={1}
                    chevronWidth={300}
                  />
                )}
                <hr />
                {twoData !== undefined && (
                  <CardContainer
                    title={"🎈 풀옵션, 모든 것이 갖춰진 카페"}
                    data={twoData}
                    type={1}
                    chevronWidth={300}
                  />
                )}
                <hr />
                {oneData !== undefined && (
                  <CardContainer
                    title={"✨ 새로운, 최근 오픈 신상 카페"}
                    data={oneData}
                    type={1}
                    chevronWidth={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  // Mobile View
  return (
    <div className="w-full pb-20">
      <div>
        <Banner />
      </div>
      <div>
        <div>
          {" "}
          {oneData !== undefined && (
            <CardContainer
              title={"🔥 핫플, 인기 있는 카페"}
              data={oneData}
              type={1}
              chevronWidth={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}