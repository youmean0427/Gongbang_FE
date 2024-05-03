import { useEffect, useState } from "react";
import "./Card.css";
import ItemsCarousel from "react-items-carousel";
import { useMutation } from "react-query";
import { deleteReviewAPI } from "../../../apis/api";
import { Link } from "react-router-dom";
// import Review from "../../pages/Reveiw";
// import ListContainer from "../list/ListContainer";
// import Stars from "../common/Stars";

import { LuChevronRightCircle } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Stars from "./Stars";
import Modal from "./Modal";
import { CardData, TypeCode } from "../../../types/type";
import { LuChevronLeftCircle } from "react-icons/lu";
import { isBrowser, isMobile } from "react-device-detect";
export default function CardContainer({
  title,
  data,
  type,
  chevronWidth,
  isReviewModal,
  isCreateModal,
}: CardData) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [toggleReviewDetailModal, setToggleReviewDetailModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const username = useSelector((state: RootState) => state.user.username);
  const typeCode: TypeCode = { 1: "분위기", 2: "좌석", 3: "음료", 4: "콘센트" };

  const reviewDeleteMutation = useMutation(
    ["deleteReview"],
    (id: number) => deleteReviewAPI(id),
    {
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  const handleDelete = (review_id: number) => {
    reviewDeleteMutation.mutate(review_id);
  };

  const handelReviewDetailModal = (modalData: string) => {
    setReviewModalData(modalData);
    setToggleReviewDetailModal(true);
  };

  const handleReviewModal = () => {
    setReviewModalData("");
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cafe Card
  if (type === 1 && isBrowser)
    return (
      <div className="w-full mt-12 mb-10 ">
        {/* <div className="element"> */}
        <div className="w-full">
          <div className="text-2xl font-semibold mb-7">{title}</div>
          <div className="flex">
            <div className="w-full">
              <ItemsCarousel
                requestToChangeActive={setActiveItemIndex}
                activeItemIndex={activeItemIndex}
                numberOfCards={windowWidth < 1280 ? 3 : 4}
                gutter={10}
                leftChevron={
                  <button className="h-full">
                    <LuChevronLeftCircle size={30} />
                  </button>
                }
                rightChevron={
                  <button className="h-full">
                    <LuChevronRightCircle size={30} />
                  </button>
                }
                // outsideChevron
                chevronWidth={100}
              >
                {data.map((x, i) => (
                  <Link
                    to={`coffeecafe/${x.id}`}
                    style={{ textDecoration: "none" }}
                    key={i}
                  >
                    <div className="text-lg ">
                      <div className="mb-5 h-80">
                        {x.coffeecafeimage_set &&
                          x.coffeecafeimage_set.length > 0 && (
                            <div className="w-full h-full">
                              <img
                                className="object-cover w-full h-full rounded-2xl"
                                src={
                                  process.env.REACT_APP_API_URL +
                                  x.coffeecafeimage_set[0].image
                                }
                                alt="Cafe"
                              />
                            </div>
                          )}
                      </div>

                      <div className="">
                        <Stars score={x.total_score} size="small" />
                      </div>
                      <div className="text-xl font-medium">{x.name}</div>
                      <div className="text-base ">{x.address}</div>
                    </div>
                  </Link>
                ))}
              </ItemsCarousel>
            </div>
          </div>
        </div>
      </div>
    );
  // Review Card
  if (isBrowser)
    return (
      <>
        <div className="mt-5 mb-5 ">
          <div className="flex items-center justify-between mb-10">
            {title.length > 0 && (
              <div className="text-2xl font-semibold">📝 {title}</div>
            )}
            <div className="flex ">
              {username && type == 2 ? (
                <div onClick={isCreateModal} className="text-base btn">
                  리뷰 작성하기
                </div>
              ) : (
                <div></div>
              )}
              {type == 2 && (
                <div
                  className="ml-5 text-base cursor-pointer btn"
                  onClick={isReviewModal}
                >
                  모든 리뷰 보기
                </div>
              )}
            </div>
          </div>

          <ItemsCarousel
            requestToChangeActive={setActiveItemIndex}
            activeItemIndex={activeItemIndex}
            numberOfCards={windowWidth < 1280 ? 3 : 4}
            gutter={20}
            leftChevron={
              <button className="h-full">
                <LuChevronLeftCircle size={30} />
              </button>
            }
            rightChevron={
              <button className="h-full">
                <LuChevronRightCircle size={30} />
              </button>
            }
            outsideChevron
            chevronWidth={chevronWidth}
          >
            {data.map((data: any, i: number) => (
              <div
                key={i}
                onClick={() => handelReviewDetailModal(data)}
                className=" max-w-96"
              >
                {/* Images */}
                <div className="mb-3">
                  {data.reviewimage_set.length ? (
                    <img
                      className="w-full rounded-2xl"
                      src={
                        process.env.REACT_APP_API_URL +
                        data.reviewimage_set[0].image
                      }
                      alt="Cafe"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
                {/* <div>{data.id}</div> */}

                {/* Info */}
                <Stars score={data.score} size="small" />
                <div className="w-full mt-3 text-xl font-medium truncate ">
                  {data.title}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="p-3 text-sm font-medium badge badge-outline">
                    {typeCode[data.type]}
                  </div>
                  <div className="text-base">{data.name}</div>
                </div>
                <div></div>
              </div>
            ))}{" "}
          </ItemsCarousel>
          {!data.length && (
            <div className="flex items-center justify-center text-xl text-center h-[350px]">
              <div>리뷰가 없습니다.</div>
            </div>
          )}
          {reviewModalData ? (
            <Modal close={handleReviewModal} data={reviewModalData} type={0} />
          ) : (
            <></>
          )}

          {/* Modal */}
          {/* <div>
          {reviewModalData ? (
            <div className="review-Modal">
              <div onClick={handleReviewModal}>
               
              </div>
              <div className="review-Modal-List">
                <div>
                  <ListContainer data={reviewModalData} />
                </div>
              </div>
            </div>
          ) : null}
        </div> */}
        </div>
      </>
    );

  // Mobile View
  if (isMobile && type === 1)
    return (
      <>
        <div className="w-full mt-12 mb-10 ">
          {/* <div className="element"> */}

          <div className="w-full">
            <div className="text-xl font-bold mb-7">{title}</div>
            <div className="flex">
              <div className="w-full">
                <ItemsCarousel
                  requestToChangeActive={setActiveItemIndex}
                  activeItemIndex={activeItemIndex}
                  numberOfCards={2}
                  gutter={1}
                  leftChevron={
                    <button className="h-full">
                      <LuChevronLeftCircle size={30} />
                    </button>
                  }
                  rightChevron={
                    <button className="h-full">
                      <LuChevronRightCircle size={30} />
                    </button>
                  }
                  // outsideChevron
                  chevronWidth={100}
                >
                  {data.map((x, i) => (
                    <Link
                      to={`coffeecafe/${x.id}`}
                      style={{ textDecoration: "none" }}
                      key={i}
                    >
                      <div className="text-lg ">
                        <div className="mb-5 h-30">
                          {x.coffeecafeimage_set &&
                            x.coffeecafeimage_set.length > 0 && (
                              <div className="w-full h-full">
                                <img
                                  className="object-cover w-full h-full rounded-2xl"
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    x.coffeecafeimage_set[0].image
                                  }
                                  alt="Cafe"
                                />
                              </div>
                            )}
                        </div>

                        <div className="w-[90%]">
                          <Stars score={x.total_score} size="small" />
                        </div>
                        <div className="text-lg font-bold">{x.name}</div>
                        <div className="text-sm ">{x.address}</div>
                      </div>
                    </Link>
                  ))}
                </ItemsCarousel>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  return (
    <div className="w-full mt-5 mb-5">
      <div className="flex items-center justify-between mb-10">
        {title.length > 0 && (
          <div className="text-xl font-bold">📝 {title}</div>
        )}
        <div className="flex ">
          {username && type == 2 ? (
            <div onClick={isCreateModal} className="text-sm btn">
              리뷰작성
            </div>
          ) : (
            <div></div>
          )}
          {type == 2 && (
            <div
              className="ml-2 text-sm cursor-pointer btn"
              onClick={isReviewModal}
            >
              모든리뷰
            </div>
          )}
        </div>
      </div>

      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={2}
        gutter={20}
        leftChevron={
          <button className="h-full">
            <LuChevronLeftCircle size={20} />
          </button>
        }
        rightChevron={
          <button className="h-full">
            <LuChevronRightCircle size={20} />
          </button>
        }
        outsideChevron
        chevronWidth={chevronWidth}
      >
        {data.map((data: any, i: number) => (
          <div key={i} onClick={() => handelReviewDetailModal(data)}>
            {/* Images */}
            <div className="mb-3">
              {data.reviewimage_set.length ? (
                <img
                  className="w-full rounded-2xl"
                  src={
                    process.env.REACT_APP_API_URL +
                    data.reviewimage_set[0].image
                  }
                  alt="Cafe"
                />
              ) : (
                <div></div>
              )}
            </div>
            {/* <div>{data.id}</div> */}

            {/* Info */}
            <Stars score={data.score} size="small" />
            <div className="w-full mt-3 text-lg font-medium truncate ">
              {data.title}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="p-3 text-sm font-medium badge badge-outline">
                {typeCode[data.type]}
              </div>
              <div className="text-sm">{data.name}</div>
            </div>
            <div></div>
          </div>
        ))}{" "}
      </ItemsCarousel>
      {!data.length && (
        <div className="flex items-center justify-center text-lg text-center h-[350px]">
          <div>리뷰가 없습니다.</div>
        </div>
      )}
      {reviewModalData ? (
        <Modal close={handleReviewModal} data={reviewModalData} type={0} />
      ) : (
        <></>
      )}
      {/* Modal */}
      {/* <div>
          {reviewModalData ? (
            <div className="review-Modal">
              <div onClick={handleReviewModal}>
               
              </div>
              <div className="review-Modal-List">
                <div>
                  <ListContainer data={reviewModalData} />
                </div>
              </div>
            </div>
          ) : null}
        </div> */}
    </div>
  );
}
