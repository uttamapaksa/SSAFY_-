import BadgeModal from "./BadgeModal";
import OpenViduVideoComponent from "./OvVideo";
// import './UserVideo.css';
import {
  ProfileImg,
  VedioHoverMenu,
  VedioInnerDiv,
  VedioOuterDiv,
} from "./UserVideoComponent.style";
import React, { useCallback, MouseEvent, useState, useEffect, useRef } from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import { selectedMember } from "/src/recoil/Meeting";
import { CurrentUserAtom } from "/src/recoil/Auth";
import { getMember } from "/src/api/meeting";
import { postFollow } from "/src/api/profile";

const UserVideoComponent = (props: any) => {
  const [selected, setSelected] = useRecoilState(selectedMember);
  const currentUser = useRecoilValue(CurrentUserAtom);
  const [isOver, setOver] = useState<boolean>(false);
  const [isMuted, toggleMuted] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState(currentUser.nickname);
  const [userEmail, setUserEmail] = useState("");
  const [userImgURL, setuserImgURL] = useState<string>("");
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (props.streamManager !== undefined) {
      const data = props.streamManager.stream.connection.data;
      const validJsonData = data.split("%/%")[0];
      setUserData(JSON.parse(validJsonData).clientData);
    } else {
      console.log(props.streamManager.stream.data);
    }
  }, []);

  const setUserData = async (email: string) => {
    setOver(false);
    const response = await getMember(email);

    setUserEmail(email);
    setUserNickname(response.data.nickname);
    setUserId(response.data.id);
    setuserImgURL("https://b106-voss.s3.ap-northeast-2.amazonaws.com/"+response.data.imageUrl);
     setSelected({
      userId: userId,
      email: userEmail,
      nickname: userNickname,
      userImgURL: userImgURL,
    });
  };

  const handleMouseOver = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!props.isOpenModal) setOver(true);
  };
  const handleMouseOut = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!props.isOpenModal) setOver(false);
  };

  const onClickMute = useCallback(() => {
    toggleMuted(!isMuted);
  }, [isMuted]);

  const onClickFollow = async () => {
    const response = await postFollow(userId);
    if (response.isFollowSuccess) alert("팔로우 성공");
    else alert("이미 팔로우한 사용자입니다.");
  };

  const onClickGiveBadge = () => {
    setUserData(userEmail);
    props.onClickToggleModal();
  };

  return (
    <VedioOuterDiv
      className="streamcomponent"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {props.videoActive ? (
        <ProfileImg id="111">
          <img src={userImgURL} alt="이미지가 들어갈 자리입니다" />
        </ProfileImg>
      ) : (
        <></>
      )}
      {props.streamManager !== undefined ? (
        <>
          {isOver && props.isOpenModal !== undefined && !props.isOpenModal ? (
            <>
              <VedioHoverMenu style={{ top: "25%" }} onClick={onClickGiveBadge}>
                {" "}
                뱃지주기
              </VedioHoverMenu>
              <VedioHoverMenu style={{ top: "50%" }} onClick={onClickFollow}>
                {" "}
                + 팔로우
              </VedioHoverMenu>
              <VedioHoverMenu style={{ top: "75%" }} onClick={onClickMute}>
                {" "}
                {!isMuted ? "음소거" : "음소거 해제"}
              </VedioHoverMenu>
            </>
          ) : (
            <></>
          )}

          <VedioInnerDiv>{userNickname} </VedioInnerDiv>

          <OpenViduVideoComponent streamManager={props.streamManager} isMuted={isMuted} />
        </>
      ) : null}
    </VedioOuterDiv>
  );
};

export default UserVideoComponent;
