package com.yukgaejang.voss.domain.recordboard.repository;

import com.yukgaejang.voss.domain.recordboard.repository.entity.Record;
import com.yukgaejang.voss.domain.recordboard.service.dto.response.MyRecordListResponse;
import com.yukgaejang.voss.domain.recordboard.service.dto.response.RecordDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecordSupportRepository {

    Record findByIdAndIsDeletedFalse(Long id);
    Page<RecordDetailResponse> findAllByConditionAndIsDeletedFalse(Pageable pageable, Long memberId, String description, String nickname);
    Page<MyRecordListResponse> findAllByMemberEmailAndIsDeletedFalse(Pageable pageable, String email);
}
